/**
 * Fetches NYC flood GeoJSON datasets from ArcGIS Feature Services and NYC Open Data.
 * Writes processed files to public/data/.
 * Run with: npm run fetch-data
 */
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const OUT_DIR = join(process.cwd(), 'public', 'data')

// ArcGIS Feature Service base — paginated GeoJSON query
const ARCGIS_BASE = 'https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/ArcGIS/rest/services'
const SODA_BASE = 'https://data.cityofnewyork.us/resource'

interface ArcGISDataset {
  name: string
  filename: string
  url: string
  layerId?: number
  outFields?: string
}

const arcgisDatasets: ArcGISDataset[] = [
  {
    name: 'Stormwater — Extreme + 2080 SLR',
    filename: 'stormwater-extreme.geojson',
    url: `${ARCGIS_BASE}/DEP_Stormwater___Extreme_with_2080_Sea_Level_Rise/FeatureServer`,
    layerId: 10,
  },
  {
    name: 'Stormwater — Moderate + 2050 SLR',
    filename: 'stormwater-moderate.geojson',
    url: `${ARCGIS_BASE}/DEP_Stormwater___Moderate_with_2050_Sea_Level_Rise/FeatureServer`,
    layerId: 12,
  },
  {
    name: 'Stormwater — Moderate Current SLR',
    filename: 'stormwater-limited.geojson',
    url: `${ARCGIS_BASE}/DEP_Stormwater___Moderate_with_Current_Sea_Level_Rise/FeatureServer`,
    layerId: 14,
  },
  {
    name: 'Hurricane Evacuation Zones',
    filename: 'hurricane-evacuation-zones.geojson',
    url: `${ARCGIS_BASE}/NYC_Hurricane_Evacuation_Zone/FeatureServer`,
    layerId: 0,
  },
]

const sodaDatasets = [
  {
    name: 'NYC Flood Vulnerability Index (Map)',
    filename: 'flood-vulnerability-index.geojson',
    url: `${SODA_BASE}/4vym-qrg3.geojson?$limit=10000`,
  },
  {
    name: '2020 Neighborhood Tabulation Areas',
    filename: 'nta-boundaries.geojson',
    url: `${SODA_BASE}/9nt8-h7nd.geojson?$limit=300`,
  },
]

async function fetchArcGISLayer(dataset: ArcGISDataset): Promise<object> {
  const layerId = dataset.layerId ?? 0
  const baseUrl = `${dataset.url}/${layerId}/query`

  const params = new URLSearchParams({
    where: '1=1',
    outFields: dataset.outFields ?? '*',
    outSR: '4326',
    f: 'geojson',
    // Simplify geometry server-side: 0.001 degrees ≈ 100m accuracy (good for zoom 9-13)
    maxAllowableOffset: '0.001',
  })

  const res = await fetch(`${baseUrl}?${params}`)
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`)
  return res.json()
}

async function fetchSodaDataset(url: string): Promise<object> {
  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

async function main() {
  console.log('📡 Fetching NYC Flood GeoJSON datasets...\n')
  await mkdir(OUT_DIR, { recursive: true })

  for (const dataset of arcgisDatasets) {
    process.stdout.write(`  Fetching: ${dataset.name}... `)
    try {
      const data = await fetchArcGISLayer(dataset)
      const features = (data as { features: object[] }).features
      await writeFile(join(OUT_DIR, dataset.filename), JSON.stringify(data))
      console.log(`✅ ${features.length} features → ${dataset.filename}`)
    } catch (err) {
      console.log(`⚠️  Failed: ${err}`)
      await writeFile(join(OUT_DIR, dataset.filename), JSON.stringify({ type: 'FeatureCollection', features: [] }))
    }
  }

  for (const dataset of sodaDatasets) {
    process.stdout.write(`  Fetching: ${dataset.name}... `)
    try {
      const data = await fetchSodaDataset(dataset.url)
      const features = (data as { features?: object[] }).features ?? []
      await writeFile(join(OUT_DIR, dataset.filename), JSON.stringify(data))
      console.log(`✅ ${features.length} features → ${dataset.filename}`)
    } catch (err) {
      console.log(`⚠️  Failed: ${err}`)
      await writeFile(join(OUT_DIR, dataset.filename), JSON.stringify({ type: 'FeatureCollection', features: [] }))
    }
  }

  console.log('\n✅ All datasets written to public/data/')
  console.log('\nNote: FEMA NFHL flood zones are streamed live as a WMS raster overlay.')
}

main().catch((err) => {
  console.error('Fatal:', err)
  process.exit(1)
})
