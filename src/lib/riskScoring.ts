import type { StormwaterScenario, FemaZone, HurricaneEvacZone, RiskLevel, FloodZoneResult } from '@/types/flood'

// Points per category (max 8 total)
const STORMWATER_POINTS: Record<StormwaterScenario, number> = {
  extreme: 3,
  moderate: 2,
  limited: 1,
  none: 0,
}

const FEMA_POINTS: Record<FemaZone, number> = {
  VE: 3,
  AE: 2,
  AO: 1,
  A: 1,
  X: 0,
  none: 0,
}

const EVAC_POINTS: Record<HurricaneEvacZone, number> = {
  '1': 2,
  '2': 2,
  '3': 1,
  '4': 1,
  '5': 0,
  '6': 0,
  X: 0,
  none: 0,
}

function riskLevelFromScore(score: number): RiskLevel {
  if (score <= 1) return 'low'
  if (score <= 3) return 'moderate'
  if (score <= 5) return 'high'
  return 'extreme'
}

export function computeRiskScore(
  stormwater: StormwaterScenario,
  femaZone: FemaZone,
  evacuationZone: HurricaneEvacZone,
  fviScore: number | null,
): { score: number; level: RiskLevel } {
  const stormPts = STORMWATER_POINTS[stormwater]
  const femaPts = FEMA_POINTS[femaZone]
  const evacPts = EVAC_POINTS[evacuationZone]
  // FVI contributes 0-2 pts (normalized 0-1 → scaled)
  const fviPts = fviScore !== null ? Math.round(fviScore * 2) : 0

  const score = stormPts + femaPts + evacPts + fviPts
  return { score, level: riskLevelFromScore(score) }
}

export function riskLevelLabel(level: RiskLevel): string {
  return level.charAt(0).toUpperCase() + level.slice(1)
}

export function riskDescription(result: FloodZoneResult): string {
  const parts: string[] = []

  if (result.stormwater !== 'none') {
    const scenarioMap: Record<StormwaterScenario, string> = {
      extreme: 'extreme rainfall events (3.66 in/hr)',
      moderate: 'moderate rainfall events (2.13 in/hr)',
      limited: 'limited rainfall events (1.77 in/hr)',
      none: '',
    }
    parts.push(`This location is within the projected stormwater flood zone for ${scenarioMap[result.stormwater]}`)
  }

  if (result.femaZone !== 'none' && result.femaZone !== 'X') {
    const femaMap: Record<FemaZone, string> = {
      VE: 'a FEMA VE zone — the highest coastal risk, subject to wave action and storm surge',
      AE: 'a FEMA AE zone — high risk from coastal or riverine flooding with a defined base flood elevation',
      AO: 'a FEMA AO zone — shallow flooding risk from sheet flow',
      A: 'a FEMA A zone — high risk area where base flood elevation is not yet determined',
      X: '',
      none: '',
    }
    parts.push(`It falls within ${femaMap[result.femaZone]}`)
  }

  if (result.evacuationZone !== 'none' && result.evacuationZone !== 'X') {
    parts.push(`Hurricane Evacuation Zone ${result.evacuationZone} — residents in this zone should evacuate for major storms`)
  }

  if (parts.length === 0) {
    return 'This address has low measured flood risk based on current stormwater and coastal flood models.'
  }

  return parts.join('. ') + '.'
}
