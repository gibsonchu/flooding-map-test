export type RiskLevel = 'low' | 'moderate' | 'high' | 'extreme' | 'unknown'

export type StormwaterScenario =
  | 'extreme'     // 3.66 in/hr + 2080 sea level rise
  | 'moderate'    // 2.13 in/hr + 2050 sea level rise
  | 'limited'     // 1.77 in/hr + current sea levels
  | 'none'

export type FemaZone = 'VE' | 'AE' | 'AO' | 'A' | 'X' | 'none'

export type HurricaneEvacZone = '1' | '2' | '3' | '4' | '5' | '6' | 'X' | 'none'

export interface FloodZoneResult {
  stormwater: StormwaterScenario
  femaZone: FemaZone
  evacuationZone: HurricaneEvacZone
  fviScore: number | null   // 0-1 normalized
  fviPercentile: number | null
  riskLevel: RiskLevel
  riskScore: number         // 0-8 composite
  neighborhood: string | null
  nta_code: string | null
}

export interface LayerVisibility {
  stormwaterExtreme: boolean
  stormwaterModerate: boolean
  stormwaterLimited: boolean
  femaZones: boolean
  evacuationZones: boolean
  floodVulnerability: boolean
}

export interface MapViewport {
  longitude: number
  latitude: number
  zoom: number
  bearing: number
  pitch: number
}
