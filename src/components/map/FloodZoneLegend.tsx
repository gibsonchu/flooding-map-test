import { useMapStore } from '@/store/mapStore'
import { STORMWATER_COLORS, FEMA_COLORS, EVAC_COLORS } from '@/lib/constants'

interface LegendItem {
  color: string
  label: string
  opacity?: number
}

export function FloodZoneLegend() {
  const { layerVisibility } = useMapStore()

  const anyActive =
    layerVisibility.stormwaterExtreme ||
    layerVisibility.stormwaterModerate ||
    layerVisibility.stormwaterLimited ||
    layerVisibility.femaZones ||
    layerVisibility.evacuationZones ||
    layerVisibility.floodVulnerability

  if (!anyActive) return null

  const stormwaterItems: LegendItem[] = [
    { color: STORMWATER_COLORS.extreme, label: 'Extreme (2080 SLR)', opacity: 0.7 },
    { color: STORMWATER_COLORS.moderate, label: 'Moderate (2050 SLR)', opacity: 0.6 },
    { color: STORMWATER_COLORS.limited, label: 'Limited (current)', opacity: 0.5 },
  ]

  const femaItems: LegendItem[] = [
    { color: FEMA_COLORS.VE, label: 'VE — High coastal (wave action)', opacity: 0.65 },
    { color: FEMA_COLORS.AE, label: 'AE — High risk (base flood elev.)', opacity: 0.65 },
    { color: FEMA_COLORS.X, label: 'X — Moderate/minimal risk', opacity: 0.65 },
  ]

  const evacItems: LegendItem[] = [
    { color: EVAC_COLORS['1'], label: 'Zone 1 — Highest risk', opacity: 0.5 },
    { color: EVAC_COLORS['2'], label: 'Zone 2', opacity: 0.5 },
    { color: EVAC_COLORS['3'], label: 'Zone 3', opacity: 0.5 },
    { color: EVAC_COLORS['4'], label: 'Zone 4+', opacity: 0.5 },
  ]

  return (
    <div className="absolute bottom-8 left-4 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 max-w-[200px] z-10 text-xs">
      {(layerVisibility.stormwaterExtreme || layerVisibility.stormwaterModerate || layerVisibility.stormwaterLimited) && (
        <div className="mb-2">
          <p className="font-semibold text-slate-700 mb-1">Stormwater Flood</p>
          {stormwaterItems
            .filter((_, i) =>
              [layerVisibility.stormwaterExtreme, layerVisibility.stormwaterModerate, layerVisibility.stormwaterLimited][i]
            )
            .map((item) => (
              <div key={item.label} className="flex items-center gap-2 mb-0.5">
                <div
                  className="w-4 h-3 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: item.color, opacity: item.opacity }}
                />
                <span className="text-slate-600">{item.label}</span>
              </div>
            ))}
        </div>
      )}

      {layerVisibility.femaZones && (
        <div className="mb-2">
          <p className="font-semibold text-slate-700 mb-1">FEMA Flood Zones</p>
          {femaItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2 mb-0.5">
              <div
                className="w-4 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: item.color, opacity: item.opacity }}
              />
              <span className="text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {layerVisibility.evacuationZones && (
        <div className="mb-2">
          <p className="font-semibold text-slate-700 mb-1">Hurricane Evac Zones</p>
          {evacItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2 mb-0.5">
              <div
                className="w-4 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: item.color, opacity: item.opacity }}
              />
              <span className="text-slate-600">{item.label}</span>
            </div>
          ))}
        </div>
      )}

      {layerVisibility.floodVulnerability && (
        <div>
          <p className="font-semibold text-slate-700 mb-1">Flood Vulnerability</p>
          <div className="flex items-center gap-1">
            <span className="text-slate-500">Low</span>
            <div
              className="flex-1 h-3 rounded"
              style={{
                background: 'linear-gradient(to right, #f0fdf4, #86efac, #facc15, #f97316, #dc2626)',
              }}
            />
            <span className="text-slate-500">High</span>
          </div>
        </div>
      )}
    </div>
  )
}
