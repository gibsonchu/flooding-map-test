import { useMapStore } from '@/store/mapStore'

export function InfoModal() {
  const { isInfoOpen, setIsInfoOpen } = useMapStore()

  if (!isInfoOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && setIsInfoOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="info-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h2 id="info-modal-title" className="text-lg font-bold text-slate-900">About This Map</h2>
            <p className="text-xs text-slate-400 mt-0.5">NYC Flood Risk Explorer</p>
          </div>
          <button
            onClick={() => setIsInfoOpen(false)}
            className="text-slate-400 hover:text-slate-600 transition-colors ml-4"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 space-y-4 text-sm text-slate-600">
          <section>
            <h3 className="font-semibold text-slate-800 mb-1">What does this map show?</h3>
            <p>
              This map shows NYC's flood risk from two different types of flooding: stormwater
              (heavy rain overwhelming drains) and coastal flooding (storm surge and tidal flooding
              from the ocean). Each addresses a different hazard — a neighborhood might face one,
              both, or neither.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-1">Stormwater Flood Maps</h3>
            <p className="mb-2">
              Developed by NYC DEP using the <strong>NYC Stormwater Resiliency Plan</strong> methodology.
              Three scenarios are shown:
            </p>
            <ul className="space-y-1 pl-4">
              <li><span className="font-medium text-blue-900">Extreme</span> — 3.66 in/hr rainfall + projected 2080 sea level rise</li>
              <li><span className="font-medium text-blue-700">Moderate</span> — 2.13 in/hr rainfall + projected 2050 sea level rise</li>
              <li><span className="font-medium text-blue-400">Limited</span> — 1.77 in/hr rainfall at current sea levels</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-1">FEMA Flood Zones</h3>
            <p>
              Shown as a live overlay from FEMA's <strong>National Flood Hazard Layer (NFHL)</strong>.
              Key zones:
            </p>
            <ul className="space-y-1 pl-4 mt-1">
              <li><span className="font-medium text-purple-800">VE</span> — Coastal high hazard, subject to wave action. Highest risk.</li>
              <li><span className="font-medium text-purple-600">AE</span> — 1% annual flood chance (100-year flood), with defined elevation.</li>
              <li><span className="font-medium text-slate-500">X</span> — Moderate to minimal risk area.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-1">Hurricane Evacuation Zones</h3>
            <p>
              NYC OEM designates zones 1–6 based on storm surge risk. Zone 1 faces the greatest
              risk and should evacuate for any hurricane. Zones 2+ evacuate for stronger storms.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-1">Flood Vulnerability Index (FVI)</h3>
            <p>
              Created by the NYC Mayor's Office of Climate and Environmental Justice (MOCEJ). Combines
              flood exposure with a <em>Flood Susceptibility to Harm and Recovery Index</em> — a measure
              of socioeconomic factors including income, disability, language access, and housing stability.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-1">Risk Score</h3>
            <p>
              The composite risk score (0–8) combines stormwater scenario, FEMA zone,
              hurricane evacuation zone, and FVI percentile. It is a simplified indicator —
              not an official risk designation. Always consult official sources for
              insurance and emergency planning.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-800 mb-1">Limitations</h3>
            <p>
              Flood risk models reflect conditions at the time of data publication.
              FEMA flood maps may not reflect recent changes. Stormwater maps represent
              pluvial flooding scenarios, not actual flood records. This tool is for
              informational purposes only.
            </p>
          </section>
        </div>

        <div className="px-6 py-3 bg-slate-50 rounded-b-2xl border-t border-slate-100">
          <p className="text-xs text-slate-400">
            Built with NYC Open Data · FEMA NFHL · NYC GeoSearch API · MapLibre GL JS
          </p>
        </div>
      </div>
    </div>
  )
}
