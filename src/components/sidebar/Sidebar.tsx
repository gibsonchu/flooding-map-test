import { AddressSearch } from './AddressSearch'
import { RiskSummaryCard } from './RiskSummaryCard'
import { LayerToggle } from './LayerToggle'
import { DATA_SOURCES } from '@/lib/constants'

export function Sidebar() {
  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      {/* Scrollable content */}
      <div className="flex-1 px-4 py-4 space-y-0 min-h-0 overflow-y-auto">
        {/* Intro */}
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          Search any NYC address to see stormwater and coastal flood risk based on official
          city and FEMA data.
        </p>

        {/* Address search */}
        <AddressSearch />

        {/* Risk result card */}
        <RiskSummaryCard />

        {/* Layer toggles */}
        <div className="mt-4">
          <hr className="border-slate-200 mb-4" />
          <LayerToggle />
        </div>

        {/* Data sources */}
        <div className="mt-6">
          <hr className="border-slate-200 mb-3" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">Data Sources</p>
          <ul className="space-y-1">
            {DATA_SOURCES.map((src) => (
              <li key={src.name} className="text-xs">
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {src.name}
                </a>
                <span className="text-slate-400"> · {src.org} · {src.updated}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
