# NYC Flood Risk Interactive Map — Implementation Plan

## Overview

A public-facing microsite that lets any NYC resident search their address and instantly see
stormwater and coastal flood risk for their neighborhood and block. Built on authoritative NYC
Open Data and FEMA datasets. Designed to be extended with community flood photos, real-time
sensor data, and rental/housing risk planning.

---

## 1. Recommended Tech Stack

### Frontend Framework
- **React 18 + TypeScript** — component model maps naturally to map layers, panels, and modals
- **Vite** — fast dev server, small production bundles, first-class TS support

### Map Engine
- **MapLibre GL JS** — fully open-source (BSD-2-Clause) fork of Mapbox GL JS v1; WebGL-accelerated
  vector tile rendering; no API key required for the core engine; handles 50k+ polygon features
  without performance degradation
- **react-map-gl (vis.gl)** — battle-tested React wrapper; `react-map-gl/maplibre` adapter gives
  full MapLibre support with React's declarative component model

### Base Map Tiles
- **MapTiler** — free tier (75k tile requests/mo); OpenStreetMap-based; provides dark/light street
  styles that keep flood overlays visually prominent
- Fallback: **OpenFreeMap** (zero-cost, no key) or self-host OpenMapTiles

### Geocoding / Address Search
- **NYC GeoSearch API** (https://geosearch.planninglabs.nyc) — free, no API key, uses official
  NYC Property Address Directory (PAD) data; returns BBL (Borough-Block-Lot) + coordinates
- Provides autocomplete/typeahead for address input

### Geospatial Analysis
- **Turf.js** — point-in-polygon queries to determine which flood zone a searched address falls
  within; distance calculations; bbox clipping

### Data Sources (NYC Open Data + FEMA)

| Dataset | Source | Dataset ID / Endpoint |
|---|---|---|
| NYC Stormwater Flood Maps | NYC Open Data | `9i7c-xyvv` |
| NYC Flood Vulnerability Index (tabular) | NYC Open Data | `mrjc-v9pm` |
| NYC Flood Vulnerability Index (map) | NYC Open Data | `4vym-qrg3` |
| 2020 Neighborhood Tabulation Areas | NYC Open Data | `9nt8-h7nd` |
| FEMA NFHL Flood Zones (AE/VE/X) | FEMA GIS WMS | `hazards.fema.gov/gis/nfhl` |
| Hurricane Evacuation Zones | NYC OEM via Open Data | existing GeoJSON |

NYC Open Data SODA API base: `https://data.cityofnewyork.us/resource/{id}.geojson`
FEMA NFHL WMS: `https://hazards.fema.gov/gis/nfhl/services/public/NFHL/MapServer/WMSServer`

### Styling
- **Tailwind CSS** — utility-first; fast iteration on responsive sidebar/panel layouts
- **shadcn/ui** — accessible, unstyled components (Dialog, Combobox, Badge, Tooltip) that compose
  cleanly with Tailwind

### State Management
- **Zustand** — lightweight store for map viewport state, selected address, active layers,
  risk score; avoids Redux boilerplate for a microsite

### Future Iteration: Photo Layer
- **Flickr API** or **Wikimedia Commons API** — geotagged flood photos; free, no scraping
- **Cloudinary** (free tier) — if users upload community photos
- Rendered as **MapLibre symbol layers** with popup previews

### Future Iteration: Housing / Rental Data
- **NYC PLUTO dataset** (`MapPLUTO`) via NYC Open Data — parcel-level land use, assessed value,
  building class; joinable by BBL from geocoding
- **StreetEasy** public listings or **Zillow API** for rental prices (requires partnership/key)

### Hosting
- **Vercel** or **Cloudflare Pages** — zero-config static deploy; free tier; CDN-backed

---

## 2. File Structure

```
floodingsite/
├── public/
│   ├── favicon.ico
│   └── data/                        # Pre-processed static GeoJSON (downloaded at build time)
│       ├── stormwater-flood-extreme.geojson
│       ├── stormwater-flood-moderate.geojson
│       ├── stormwater-flood-limited.geojson
│       ├── fema-flood-zones-nyc.geojson
│       ├── hurricane-evacuation-zones.geojson
│       └── flood-vulnerability-index.geojson
│
├── src/
│   ├── main.tsx                     # Vite entry point
│   ├── App.tsx                      # Root component; layout shell
│   │
│   ├── components/
│   │   ├── map/
│   │   │   ├── FloodMap.tsx         # Main MapLibre map container
│   │   │   ├── FloodLayers.tsx      # Toggleable GeoJSON + WMS layers
│   │   │   ├── AddressMarker.tsx    # Pin + popup for searched address
│   │   │   ├── RiskPopup.tsx        # Popup card showing flood zone details
│   │   │   └── MapControls.tsx      # Zoom, compass, geolocation controls
│   │   │
│   │   ├── sidebar/
│   │   │   ├── Sidebar.tsx          # Right/bottom panel container
│   │   │   ├── AddressSearch.tsx    # Typeahead input → NYC GeoSearch
│   │   │   ├── RiskSummaryCard.tsx  # Risk score + zone breakdown for address
│   │   │   ├── LayerToggle.tsx      # Checkbox controls for map layers
│   │   │   ├── NeighborhoodStats.tsx # NTA-level FVI data display
│   │   │   └── FloodZoneLegend.tsx  # Color-coded legend
│   │   │
│   │   ├── ui/                      # shadcn/ui primitive components
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── combobox.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── InfoModal.tsx        # "About this map" explainer
│   │
│   ├── hooks/
│   │   ├── useAddressSearch.ts      # Debounced NYC GeoSearch calls
│   │   ├── useFloodZoneLookup.ts    # Turf point-in-polygon against loaded GeoJSON
│   │   ├── useMapLayers.ts          # Layer visibility state + toggle handlers
│   │   └── useNeighborhoodData.ts   # Fetch FVI stats for hovered/selected NTA
│   │
│   ├── store/
│   │   └── mapStore.ts              # Zustand store: viewport, selected address, active layers
│   │
│   ├── lib/
│   │   ├── geocoder.ts              # NYC GeoSearch API client
│   │   ├── floodZones.ts            # Turf-based zone classification logic
│   │   ├── riskScoring.ts           # Composite risk score from multiple datasets
│   │   ├── layerStyles.ts           # MapLibre paint/layout style objects per layer
│   │   └── constants.ts             # Dataset IDs, API endpoints, NYC bbox, zone colors
│   │
│   ├── types/
│   │   ├── flood.ts                 # FloodZone, RiskLevel, StormwaterScenario types
│   │   ├── geocoder.ts              # GeoSearch response types
│   │   └── neighborhood.ts          # NTA + FVI data types
│   │
│   └── styles/
│       ├── index.css                # Tailwind base + global overrides
│       └── map.css                  # MapLibre canvas sizing rules
│
├── scripts/
│   └── fetch-geodata.ts             # Node script: download + preprocess GeoJSON from APIs
│
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. Design Considerations

### Visual Hierarchy & Risk Communication
- Use a **diverging color scale**: green (low) → yellow (moderate) → orange (high) → red (extreme)
  aligned with the four NYC stormwater flood scenarios. Avoid red-green contrast for accessibility.
- FEMA zones use a distinct **blue-violet palette** to visually separate them from stormwater layers,
  since they represent different hazard types.
- **Layer opacity**: stormwater flood polygons at 60% opacity so base map streets remain readable.
- Risk badge on each address result: clear `LOW / MODERATE / HIGH / EXTREME` label with matching color.

### Layout
- **Desktop**: two-column — full-viewport map on the left (70%), sidebar panel on the right (30%)
- **Mobile**: map fills screen, sidebar slides up from bottom as a sheet/drawer
- Address search is always visible and accessible at the top of the sidebar
- Layer toggles use a collapsible accordion so the panel doesn't overwhelm on small screens

### Performance
- Pre-download and optimize the large GeoJSON files at build time via the `scripts/fetch-geodata.ts`
  script; serve them as static files from `/public/data/` — avoids live API latency on each visit
- Use MapLibre's **vector tile sources** where available; fall back to `geojson` sources for
  smaller datasets
- Stormwater flood layers (largest datasets) are loaded lazily — only fetched when the user
  toggles them on; use `idle` event listener to avoid blocking initial render
- FEMA zones are streamed as a **WMS raster overlay** (no download required) at lower zoom levels,
  then switch to GeoJSON vector at zoom ≥ 13 for click interactivity

### Accessibility
- All color-coded risk levels also carry a text label and icon (not color alone)
- Keyboard-navigable address search with ARIA combobox pattern
- MapLibre map has `aria-label` and skip-nav link for screen readers
- Sufficient contrast ratios (WCAG AA) for all text on map overlays

### Data Trust & Transparency
- Every risk data panel includes a **"Data source"** citation with link to the origin dataset
- Explain the difference between stormwater (pluvial) and coastal/tidal (FEMA) flood risks in plain
  English in the Info modal
- Include data vintage (e.g., "Stormwater maps updated July 2024") so users understand currency

### Future Photo Layer Design
- Photos render as **circular avatar markers** clustered at low zoom; expand to image cards in
  popups at high zoom
- Tagged with flood type, date, and source attribution
- Filter panel: show photos by flood event, season, or severity

### Future Housing/Rental Layer Design
- PLUTO parcel layer colored by last-sold price or assessed value; toggleable
- Rental listings as point markers; clicking shows listing details + flood risk in same popup
- "Flood Risk Score for Renters" composite: combines FVI + FEMA zone + stormwater exposure

---

## 4. Step-by-Step Implementation Plan

### Phase 1 — Project Scaffolding (Day 1)

1. **Initialize the project**
   ```bash
   npm create vite@latest floodingsite -- --template react-ts
   cd floodingsite
   npm install
   ```

2. **Install core dependencies**
   ```bash
   npm install maplibre-gl react-map-gl @turf/turf zustand
   npm install -D tailwindcss postcss autoprefixer
   npm install @radix-ui/react-dialog @radix-ui/react-tooltip
   npx tailwindcss init -p
   ```

3. **Configure Tailwind** in `tailwind.config.ts` and import in `src/styles/index.css`

4. **Set up the base map** in `FloodMap.tsx` centered on NYC (`[-74.006, 40.7128]`, zoom 11)
   using a free MapTiler style or OpenFreeMap style URL

5. **Wire up the Zustand store** (`mapStore.ts`) with initial viewport state

---

### Phase 2 — Data Acquisition & Preprocessing (Day 1–2)

6. **Write `scripts/fetch-geodata.ts`** to download and save these datasets:
   - NYC Stormwater Flood Maps (4 scenarios) from SODA API (`9i7c-xyvv`)
   - FEMA NFHL flood zones for NYC counties (New York, Kings, Queens, Bronx, Richmond)
     via FEMA download portal or NFHL WMS
   - NYC FVI Map layer (`4vym-qrg3`)
   - Hurricane Evacuation Zones
   - 2020 NTA boundaries (`9nt8-h7nd`)

7. **Run the script**, inspect output, verify geometries are valid GeoJSON

8. **Simplify large polygons** using `mapshaper` CLI (`npm install -g mapshaper`) to reduce
   file sizes while preserving visual accuracy at city-scale zoom levels:
   ```bash
   mapshaper stormwater-flood-extreme.geojson -simplify 5% -o format=geojson
   ```

9. **Place processed files** in `public/data/`

---

### Phase 3 — Layer Rendering (Day 2–3)

10. **Implement `layerStyles.ts`** — define MapLibre paint expressions for each flood layer:
    - Fill color keyed to flood scenario (stormwater) or FEMA zone class (AE/VE/X)
    - Fill opacity expressions (highlight on hover)

11. **Build `FloodLayers.tsx`** — conditionally render `<Source>` + `<Layer>` pairs for each
    dataset; listen to `layerVisibility` from Zustand store

12. **Add FEMA WMS overlay** as a raster source for initial view; add toggle in layer controls

13. **Implement hover interaction** — use `map.on('mousemove')` to highlight hovered polygon
    and display tooltip with zone name + risk level

14. **Add `FloodZoneLegend.tsx`** — static color key panel linked to active layers

---

### Phase 4 — Address Search & Risk Lookup (Day 3–4)

15. **Build `geocoder.ts`** — typed fetch wrapper for NYC GeoSearch API:
    ```
    GET https://geosearch.planninglabs.nyc/v2/autocomplete?text={query}
    GET https://geosearch.planninglabs.nyc/v2/search?text={address}
    ```

16. **Build `useAddressSearch.ts` hook** — debounced (300ms) input → autocomplete suggestions
    → fly map to selected address coordinates

17. **Build `useFloodZoneLookup.ts` hook** — on address select:
    - Run `turf.point(coords)` against each loaded GeoJSON source
    - `turf.booleanPointInPolygon()` to determine which stormwater flood zone and FEMA zone
    - Return composite risk assessment object

18. **Build `riskScoring.ts`** — combine:
    - Stormwater flood scenario (None / Limited / Moderate / Extreme = 0–3 pts)
    - FEMA zone (X=0, AE=2, VE=3 pts)
    - FVI score for that NTA (0–1 normalized = 0–2 pts)
    - Output: `LOW (0–2) / MODERATE (3–4) / HIGH (5–6) / EXTREME (7–8)`

19. **Build `RiskSummaryCard.tsx`** — display results:
    - Address header
    - Composite risk badge
    - Per-source breakdown: stormwater scenario, FEMA zone, FVI percentile
    - Neighborhood name (from NTA)
    - Plain-English description of what each risk level means

20. **Place `AddressMarker.tsx`** on map at geocoded coordinates with animated pulse ring
    colored by risk level

---

### Phase 5 — Neighborhood Panel & Layer Controls (Day 4–5)

21. **Build `NeighborhoodStats.tsx`** — display FVI breakdown for the NTA containing the
    searched address: storm surge exposure, tidal exposure, socioeconomic susceptibility index

22. **Build `LayerToggle.tsx`** — accordion UI with toggle switches for:
    - Stormwater: Extreme / Moderate / Limited scenarios
    - FEMA Flood Zones (AE, VE, X)
    - Hurricane Evacuation Zones
    - Flood Vulnerability Index (choropleth by NTA)

23. **Wire layer toggles** to Zustand `layerVisibility` state → `FloodLayers.tsx` re-renders

24. **Build `InfoModal.tsx`** — "About this map" explainer covering:
    - What stormwater vs coastal flooding means
    - How to read the risk levels
    - Data sources and vintage dates
    - Limitations and caveats

---

### Phase 6 — Responsive Polish & Accessibility (Day 5–6)

25. **Implement mobile layout** — `<Sheet>` (bottom drawer) component for sidebar on screens
    < 768px; map fills full viewport

26. **Keyboard navigation audit** — ensure address search, layer toggles, and popups are all
    tab-reachable and ARIA-labeled

27. **Add "Use My Location" button** — browser Geolocation API → reverse geocode via NYC
    GeoSearch → run risk lookup

28. **Add social share** — generate a shareable URL with address pre-filled:
    `floodmap.nyc/?address=123+Main+St+Brooklyn+NY`; parse on load and auto-search

29. **Performance audit** — Lighthouse check; lazy-load large GeoJSON layers; add loading
    skeleton to sidebar while data fetches

---

### Phase 7 — Deployment (Day 6)

30. **Deploy to Vercel**:
    ```bash
    npm install -g vercel
    vercel --prod
    ```

31. **Set environment variables** (MapTiler key) in Vercel dashboard

32. **Add `vercel.json`** with cache headers for `/public/data/*.geojson` files (long TTL)

33. **Connect custom domain** (optional)

---

### Phase 8 — Future: Photo Layer (Future Sprint)

34. Integrate **Flickr API** geo-search: `flickr.photos.search` with bbox=NYC + tags=flood
35. Render photos as clustered marker layer in MapLibre
36. Add filter UI: date range, flood type, source
37. Optional: user upload flow via Cloudinary signed upload widget + Supabase metadata store

---

### Phase 9 — Future: Housing / Rental Layer (Future Sprint)

38. Download **MapPLUTO** GeoJSON from NYC Open Data; join with NTA flood vulnerability data
39. Add parcel choropleth layer colored by building class or assessed value
40. Integrate **StreetEasy** public data or scrape-free rental API
41. Build "Renter's Flood Risk Report" — one-page printable PDF per address using
    `maplibre-gl-export` + React to PDF

---

## Key Data URLs for Reference

- NYC Stormwater Flood Maps: https://data.cityofnewyork.us/Environment/NYC-Stormwater-Flood-Maps/9i7c-xyvv
- NYC Flood Vulnerability Index: https://data.cityofnewyork.us/Environment/New-York-City-s-Flood-Vulnerability-Index/mrjc-v9pm
- FVI Map Layer: https://data.cityofnewyork.us/Environment/New-York-City-s-Flood-Vulnerability-Index-Map/4vym-qrg3
- 2020 NTA Boundaries: https://data.cityofnewyork.us/City-Government/2020-Neighborhood-Tabulation-Areas-NTAs-/9nt8-h7nd
- NYC GeoSearch API Docs: https://geosearch.planninglabs.nyc
- FEMA NFHL Viewer: https://hazards.fema.gov/femaportal/wps/portal/NFHLWMSkmzdownload
- NYC Flood Hazard Mapper (reference): https://www.arcgis.com/apps/webappviewer/index.html?id=1c37d271fba14163bbb520517153d6d5
- NYC Flood Data GitHub Inventory: https://github.com/mebauer/nyc-flood-data
- MapLibre GL JS Docs: https://maplibre.org/maplibre-gl-js/docs/
- react-map-gl MapLibre adapter: https://visgl.github.io/react-maplibre/
