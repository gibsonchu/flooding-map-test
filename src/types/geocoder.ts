export interface GeoSearchFeature {
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number]  // [lng, lat]
  }
  properties: {
    label: string
    name: string
    borough: string
    neighbourhood: string
    county: string
    postalcode: string
    addendum?: {
      pad?: {
        bbl: string
        bin: string
      }
    }
  }
}

export interface GeoSearchResponse {
  type: 'FeatureCollection'
  features: GeoSearchFeature[]
}

export interface SearchResult {
  label: string
  coordinates: [number, number]
  borough: string
  neighbourhood: string
  postalcode: string
  bbl?: string
}
