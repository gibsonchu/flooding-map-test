import * as turf from '@turf/turf'
import type { Feature, Point, Polygon, MultiPolygon, FeatureCollection } from 'geojson'
import type { StormwaterScenario, FemaZone, HurricaneEvacZone } from '@/types/flood'

// In-memory GeoJSON cache loaded once at startup
let stormwaterExtreme: FeatureCollection | null = null
let stormwaterModerate: FeatureCollection | null = null
let stormwaterLimited: FeatureCollection | null = null
let evacuationZones: FeatureCollection | null = null
let fviData: FeatureCollection | null = null
let ntaData: FeatureCollection | null = null

export async function loadGeoData() {
  const load = async (path: string): Promise<FeatureCollection | null> => {
    try {
      const res = await fetch(path)
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    }
  }

  ;[stormwaterExtreme, stormwaterModerate, stormwaterLimited, evacuationZones, fviData, ntaData] =
    await Promise.all([
      load('/data/stormwater-extreme.geojson'),
      load('/data/stormwater-moderate.geojson'),
      load('/data/stormwater-limited.geojson'),
      load('/data/hurricane-evacuation-zones.geojson'),
      load('/data/flood-vulnerability-index.geojson'),
      load('/data/nta-boundaries.geojson'),
    ])
}

function pointInCollection(
  point: Feature<Point>,
  collection: FeatureCollection | null,
): boolean {
  if (!collection) return false
  for (const feature of collection.features) {
    if (
      feature.geometry.type === 'Polygon' ||
      feature.geometry.type === 'MultiPolygon'
    ) {
      if (turf.booleanPointInPolygon(point, feature as Feature<Polygon | MultiPolygon>)) return true
    }
  }
  return false
}

function findContainingFeature(
  point: Feature<Point>,
  collection: FeatureCollection | null,
) {
  if (!collection) return null
  for (const feature of collection.features) {
    if (
      feature.geometry.type === 'Polygon' ||
      feature.geometry.type === 'MultiPolygon'
    ) {
      if (turf.booleanPointInPolygon(point, feature as Feature<Polygon | MultiPolygon>)) return feature
    }
  }
  return null
}

export function classifyStormwater(point: Feature<Point>): StormwaterScenario {
  if (pointInCollection(point, stormwaterExtreme)) return 'extreme'
  if (pointInCollection(point, stormwaterModerate)) return 'moderate'
  if (pointInCollection(point, stormwaterLimited)) return 'limited'
  return 'none'
}

export function classifyEvacZone(point: Feature<Point>): HurricaneEvacZone {
  const feature = findContainingFeature(point, evacuationZones)
  if (!feature) return 'none'
  const props = feature.properties ?? {}
  // Property name varies by dataset version (ArcGIS uses uppercase)
  const zone = props.HURRICANE_EVACUATION_ZONE ??
    props.hurricane_evacuation_zone ??
    props.hurricane_ ??
    props.zone ??
    props.Zone ??
    props.evac_zone ??
    props.ZONE ??
    null
  if (!zone) return 'none'
  const zoneStr = String(zone)
  if (['1','2','3','4','5','6'].includes(zoneStr)) return zoneStr as HurricaneEvacZone
  return 'X'
}

export function lookupFVI(
  point: Feature<Point>,
): { score: number | null; percentile: number | null; nta_code: string | null; neighborhood: string | null } {
  const fviFeature = findContainingFeature(point, fviData)
  const ntaFeature = findContainingFeature(point, ntaData)
  const feature = fviFeature ?? ntaFeature
  if (!feature) return { score: null, percentile: null, nta_code: null, neighborhood: null }

  const props = feature.properties ?? {}

  // FVI dataset (mrjc-v9pm): fshri = flood susceptibility/harm/recovery index (1-5)
  // Normalize to 0-1 scale for display
  const fshri = props.fshri !== null && props.fshri !== undefined ? Number(props.fshri) : null
  const rawScore = fshri !== null ? (fshri - 1) / 4 : null  // 1-5 → 0-1
  const rawPercentile = fshri !== null ? Math.round((fshri - 1) / 4 * 100) : null

  // NTA name: FVI features don't have names; look up from NTA layer
  const ntaProps = ntaFeature?.properties ?? {}
  const nta_code = ntaProps.NTA2020 ?? props.geoid ?? props.nta_code ?? props.NTA2020 ?? null
  const neighborhood = ntaProps.NTAName ?? props.ntaname ?? props.NTAName ?? props.nta_name ?? null

  return {
    score: rawScore,
    percentile: rawPercentile,
    nta_code,
    neighborhood,
  }
}

// Placeholder FEMA classification — real FEMA zones require their WMS or downloaded GeoJSON.
// This is populated after FEMA GeoJSON is loaded in Phase 3.
let femaZones: FeatureCollection | null = null
export function setFemaZones(data: FeatureCollection) { femaZones = data }

export function classifyFemaZone(point: Feature<Point>): FemaZone {
  const feature = findContainingFeature(point, femaZones)
  if (!feature) return 'none'
  const props = feature.properties ?? {}
  const zone = props.FLD_ZONE ?? props.fld_zone ?? props.zone ?? ''
  const z = String(zone).toUpperCase()
  if (z === 'VE') return 'VE'
  if (z === 'AE') return 'AE'
  if (z === 'AO') return 'AO'
  if (z === 'A') return 'A'
  if (z.startsWith('X')) return 'X'
  return 'none'
}

export { stormwaterExtreme, stormwaterModerate, stormwaterLimited, evacuationZones, fviData, ntaData }
