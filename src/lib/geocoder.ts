import { GEOSEARCH_BASE } from './constants'
import type { GeoSearchResponse, SearchResult } from '@/types/geocoder'

export async function autocomplete(query: string): Promise<SearchResult[]> {
  if (query.trim().length < 3) return []

  const url = `${GEOSEARCH_BASE}/autocomplete?text=${encodeURIComponent(query)}&size=7`
  const res = await fetch(url)
  if (!res.ok) return []

  const data: GeoSearchResponse = await res.json()
  return data.features.map(f => ({
    label: f.properties.label,
    coordinates: f.geometry.coordinates,
    borough: f.properties.borough ?? '',
    neighbourhood: f.properties.neighbourhood ?? '',
    postalcode: f.properties.postalcode ?? '',
    bbl: f.properties.addendum?.pad?.bbl,
  }))
}

export async function searchAddress(query: string): Promise<SearchResult | null> {
  const url = `${GEOSEARCH_BASE}/search?text=${encodeURIComponent(query)}&size=1`
  const res = await fetch(url)
  if (!res.ok) return null

  const data: GeoSearchResponse = await res.json()
  const f = data.features[0]
  if (!f) return null

  return {
    label: f.properties.label,
    coordinates: f.geometry.coordinates,
    borough: f.properties.borough ?? '',
    neighbourhood: f.properties.neighbourhood ?? '',
    postalcode: f.properties.postalcode ?? '',
    bbl: f.properties.addendum?.pad?.bbl,
  }
}
