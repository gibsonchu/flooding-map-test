// NYC bounding box and center
export const NYC_CENTER: [number, number] = [-74.006, 40.7128]
export const NYC_BOUNDS: [[number, number], [number, number]] = [
  [-74.26, 40.49],  // SW
  [-73.69, 40.92],  // NE
]
export const NYC_DEFAULT_ZOOM = 11
export const NYC_MAX_BOUNDS: [[number, number], [number, number]] = [
  [-74.5, 40.3],
  [-73.4, 41.1],
]

// NYC Open Data SODA API base
export const SODA_BASE = 'https://data.cityofnewyork.us/resource'

// Dataset IDs
export const DATASETS = {
  stormwaterFloodMaps: '9i7c-xyvv',
  floodVulnerabilityIndex: 'mrjc-v9pm',
  fviMap: '4vym-qrg3',
  nta2020: '9nt8-h7nd',
  hurricaneEvacZones: '6zxy-h4kr', // NYC OEM hurricane evac zones
} as const

// Local static GeoJSON paths (served from /public/data/)
export const GEOJSON_PATHS = {
  stormwaterExtreme: '/data/stormwater-extreme.geojson',
  stormwaterModerate: '/data/stormwater-moderate.geojson',
  stormwaterLimited: '/data/stormwater-limited.geojson',
  fviMap: '/data/flood-vulnerability-index.geojson',
  nta: '/data/nta-boundaries.geojson',
  evacuationZones: '/data/hurricane-evacuation-zones.geojson',
} as const

// FEMA NFHL WMS endpoint
export const FEMA_WMS_URL =
  'https://hazards.fema.gov/gis/nfhl/services/public/NFHL/MapServer/WMSServer'

// NYC GeoSearch API
export const GEOSEARCH_BASE = 'https://geosearch.planninglabs.nyc/v2'

// Map tile style (OpenFreeMap — no API key needed)
export const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty'

// Risk color scale
export const RISK_COLORS = {
  low: '#22c55e',
  moderate: '#eab308',
  high: '#f97316',
  extreme: '#ef4444',
  unknown: '#94a3b8',
} as const

// Stormwater flood layer colors (blue-teal family, separate from risk scale)
export const STORMWATER_COLORS = {
  extreme: '#1e40af',   // deep blue
  moderate: '#2563eb',  // blue
  limited: '#60a5fa',   // light blue
} as const

// FEMA zone colors (violet/purple family)
export const FEMA_COLORS = {
  VE: '#7c3aed',   // extreme coastal (velocity wave action)
  AE: '#a855f7',   // high-risk coastal/riverine
  AO: '#c084fc',   // high-risk shallow flooding
  A: '#d8b4fe',    // high-risk undetermined BFE
  X: '#ede9fe',    // moderate/minimal risk
} as const

// Evacuation zone colors
export const EVAC_COLORS: Record<string, string> = {
  '1': '#dc2626',
  '2': '#ea580c',
  '3': '#d97706',
  '4': '#65a30d',
  '5': '#16a34a',
  '6': '#0891b2',
  X: '#e2e8f0',
} as const

// Data source attributions
export const DATA_SOURCES = [
  {
    name: 'NYC Stormwater Flood Maps',
    org: 'NYC DEP / Mayor\'s Office',
    url: 'https://data.cityofnewyork.us/Environment/NYC-Stormwater-Flood-Maps/9i7c-xyvv',
    updated: 'July 2024',
  },
  {
    name: 'Flood Vulnerability Index',
    org: 'NYC MOCEJ',
    url: 'https://data.cityofnewyork.us/Environment/New-York-City-s-Flood-Vulnerability-Index/mrjc-v9pm',
    updated: 'March 2024',
  },
  {
    name: 'FEMA National Flood Hazard Layer',
    org: 'FEMA',
    url: 'https://www.fema.gov/flood-maps/national-flood-hazard-layer',
    updated: 'Ongoing',
  },
  {
    name: 'Hurricane Evacuation Zones',
    org: 'NYC OEM',
    url: 'https://www.nyc.gov/site/em/ready/hurricane-zones.page',
    updated: '2023',
  },
]
