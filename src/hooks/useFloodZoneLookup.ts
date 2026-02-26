import { useCallback } from 'react'
import * as turf from '@turf/turf'
import { useMapStore } from '@/store/mapStore'
import {
  classifyStormwater,
  classifyEvacZone,
  classifyFemaZone,
  lookupFVI,
} from '@/lib/floodZones'
import { computeRiskScore } from '@/lib/riskScoring'
import type { SearchResult } from '@/types/geocoder'

export function useFloodZoneLookup() {
  const { setFloodResult, setIsAnalyzing, setSelectedAddress } = useMapStore()

  const analyze = useCallback(async (result: SearchResult) => {
    setSelectedAddress(result)
    setIsAnalyzing(true)
    setFloodResult(null)

    const pt = turf.point(result.coordinates)

    // Run all classifications concurrently (all synchronous after geodata is loaded)
    const stormwater = classifyStormwater(pt)
    const evacuationZone = classifyEvacZone(pt)
    const femaZone = classifyFemaZone(pt)
    const { score: fviScore, percentile: fviPercentile, nta_code, neighborhood } = lookupFVI(pt)

    const { score: riskScore, level: riskLevel } = computeRiskScore(
      stormwater,
      femaZone,
      evacuationZone,
      fviScore,
    )

    setFloodResult({
      stormwater,
      femaZone,
      evacuationZone,
      fviScore,
      fviPercentile,
      riskLevel,
      riskScore,
      neighborhood: neighborhood ?? result.neighbourhood ?? null,
      nta_code,
    })

    setIsAnalyzing(false)
  }, [setFloodResult, setIsAnalyzing, setSelectedAddress])

  return { analyze }
}
