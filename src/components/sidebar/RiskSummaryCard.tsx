import { useMapStore } from '@/store/mapStore'
import { RISK_COLORS } from '@/lib/constants'
import { riskLevelLabel, riskDescription } from '@/lib/riskScoring'

const STORMWATER_LABELS = {
  extreme: { label: 'Extreme (2080 SLR)', color: '#1e40af' },
  moderate: { label: 'Moderate (2050 SLR)', color: '#2563eb' },
  limited: { label: 'Limited (current)', color: '#60a5fa' },
  none: { label: 'Not in flood zone', color: '#94a3b8' },
}

const FEMA_LABELS: Record<string, { label: string; color: string }> = {
  VE: { label: 'VE — Coastal high hazard', color: '#7c3aed' },
  AE: { label: 'AE — High risk', color: '#a855f7' },
  AO: { label: 'AO — Shallow flood', color: '#c084fc' },
  A: { label: 'A — High risk (no BFE)', color: '#d8b4fe' },
  X: { label: 'X — Minimal risk', color: '#94a3b8' },
  none: { label: 'Not determined', color: '#94a3b8' },
}

const EVAC_LABELS: Record<string, { label: string; color: string }> = {
  '1': { label: 'Zone 1 — Evacuate for any hurricane', color: '#dc2626' },
  '2': { label: 'Zone 2 — Evacuate for Cat 2+', color: '#ea580c' },
  '3': { label: 'Zone 3 — Evacuate for Cat 3+', color: '#d97706' },
  '4': { label: 'Zone 4 — Evacuate for Cat 4+', color: '#65a30d' },
  '5': { label: 'Zone 5 — Evacuate for Cat 5', color: '#16a34a' },
  '6': { label: 'Zone 6 — Lower risk', color: '#0891b2' },
  X: { label: 'No evacuation zone', color: '#94a3b8' },
  none: { label: 'Not in an evac zone', color: '#94a3b8' },
}

export function RiskSummaryCard() {
  const { selectedAddress, floodResult, isAnalyzing } = useMapStore()

  if (!selectedAddress) return null

  if (isAnalyzing) {
    return (
      <div className="mt-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Analyzing flood risk...</p>
        </div>
      </div>
    )
  }

  if (!floodResult) return null

  const riskColor = RISK_COLORS[floodResult.riskLevel]
  const description = riskDescription(floodResult)
  const stormInfo = STORMWATER_LABELS[floodResult.stormwater]
  const femaInfo = FEMA_LABELS[floodResult.femaZone] ?? FEMA_LABELS.none
  const evacInfo = EVAC_LABELS[floodResult.evacuationZone] ?? EVAC_LABELS.none

  return (
    <div className="mt-4 rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      {/* Risk header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: `${riskColor}18`, borderBottom: `2px solid ${riskColor}` }}
      >
        <div>
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Flood Risk</p>
          <p className="text-xl font-bold" style={{ color: riskColor }}>
            {riskLevelLabel(floodResult.riskLevel)}
          </p>
        </div>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: riskColor }}
        >
          {floodResult.riskScore}
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        {/* Address */}
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Address</p>
          <p className="text-sm text-slate-800 leading-tight mt-0.5">{selectedAddress.label}</p>
          {floodResult.neighborhood && (
            <p className="text-xs text-slate-500 mt-0.5">
              {floodResult.neighborhood}
              {selectedAddress.borough && ` · ${selectedAddress.borough}`}
            </p>
          )}
        </div>

        <hr className="border-slate-100" />

        {/* Stormwater */}
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Stormwater Flood</p>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: stormInfo.color }}
            />
            <p className="text-sm text-slate-700">{stormInfo.label}</p>
          </div>
        </div>

        {/* FEMA Zone */}
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">FEMA Flood Zone</p>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: femaInfo.color }}
            />
            <p className="text-sm text-slate-700">{femaInfo.label}</p>
          </div>
        </div>

        {/* Evac Zone */}
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Hurricane Evacuation</p>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: evacInfo.color }}
            />
            <p className="text-sm text-slate-700">{evacInfo.label}</p>
          </div>
        </div>

        {/* FVI */}
        {floodResult.fviScore !== null && (
          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Flood Vulnerability Index</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${Math.round(floodResult.fviScore * 100)}%`,
                    background: 'linear-gradient(to right, #22c55e, #facc15, #ef4444)',
                  }}
                />
              </div>
              <span className="text-xs text-slate-600 w-8 text-right">
                {floodResult.fviPercentile !== null
                  ? `${Math.round(floodResult.fviPercentile)}%`
                  : `${Math.round(floodResult.fviScore * 100)}%`}
              </span>
            </div>
          </div>
        )}

        <hr className="border-slate-100" />

        {/* Plain English description */}
        <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
      </div>
    </div>
  )
}
