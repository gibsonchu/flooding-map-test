export interface NTAFeatureProperties {
  ntacode: string
  ntaname: string
  boroname: string
  borocode: string
  shape_area: string
  shape_leng: string
}

export interface FVIProperties {
  nta_code: string
  nta_name: string
  fvi_score?: number
  fvi_percentile?: number
  storm_surge_exposure?: number
  tidal_exposure?: number
  fshri_score?: number        // susceptibility/recovery index
  [key: string]: string | number | undefined
}
