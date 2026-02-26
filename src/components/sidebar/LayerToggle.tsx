import { useMapStore } from '@/store/mapStore'
import type { LayerVisibility } from '@/types/flood'

interface ToggleItem {
  key: keyof LayerVisibility
  label: string
  description: string
  color: string
}

const LAYERS: ToggleItem[] = [
  {
    key: 'stormwaterExtreme',
    label: 'Extreme Flood',
    description: '3.66 in/hr + 2080 sea level rise',
    color: '#1e40af',
  },
  {
    key: 'stormwaterModerate',
    label: 'Moderate Flood',
    description: '2.13 in/hr + 2050 sea level rise',
    color: '#2563eb',
  },
  {
    key: 'stormwaterLimited',
    label: 'Limited Flood',
    description: '1.77 in/hr at current sea levels',
    color: '#60a5fa',
  },
  {
    key: 'femaZones',
    label: 'FEMA Flood Zones',
    description: 'AE, VE, X insurance zones (live)',
    color: '#7c3aed',
  },
  {
    key: 'evacuationZones',
    label: 'Hurricane Evacuation',
    description: 'NYC OEM zones 1–6',
    color: '#dc2626',
  },
  {
    key: 'floodVulnerability',
    label: 'Flood Vulnerability Index',
    description: 'Socioeconomic + exposure risk by neighborhood',
    color: '#f97316',
  },
]

function Toggle({
  checked,
  onChange,
  label,
  color,
}: {
  checked: boolean
  onChange: () => void
  label: string
  color: string
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={`Toggle ${label} layer`}
      onClick={onChange}
      className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 flex-shrink-0"
      style={{ backgroundColor: checked ? color : '#e2e8f0' }}
    >
      <span
        className="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform"
        style={{ transform: checked ? 'translateX(18px)' : 'translateX(3px)' }}
      />
    </button>
  )
}

export function LayerToggle() {
  const { layerVisibility, toggleLayer } = useMapStore()

  return (
    <div className="mt-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Map Layers</p>
      <div className="space-y-1">
        {LAYERS.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-3 py-2 px-1 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
                <p className="text-sm font-medium text-slate-700 truncate">{item.label}</p>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 pl-4 leading-tight">{item.description}</p>
            </div>
            <Toggle
              checked={layerVisibility[item.key]}
              onChange={() => toggleLayer(item.key)}
              label={item.label}
              color={item.color}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
