import { useState } from 'react'
import { FloodMap } from '@/components/map/FloodMap'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { Header } from '@/components/layout/Header'
import { InfoModal } from '@/components/layout/InfoModal'
import { useMapStore } from '@/store/mapStore'

export default function App() {
  const [mobileTab, setMobileTab] = useState<'map' | 'info'>('map')
  const { selectedAddress } = useMapStore()

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100">
      <Header />

      {/* Desktop layout: map + sidebar side by side */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Sidebar — hidden on mobile, visible on md+ */}
        <aside className="hidden md:flex md:flex-col w-80 lg:w-96 flex-shrink-0 border-r border-slate-200 bg-slate-50 overflow-hidden">
          <Sidebar />
        </aside>

        {/* Map — always present */}
        <main className="flex-1 relative overflow-hidden">
          <FloodMap />
        </main>
      </div>

      {/* Mobile bottom sheet */}
      <div className="md:hidden">
        {/* Tab switcher */}
        <div className="flex border-t border-slate-200 bg-white">
          <button
            onClick={() => setMobileTab('map')}
            className={`flex-1 py-3 text-xs font-semibold transition-colors ${
              mobileTab === 'map'
                ? 'text-blue-600 border-t-2 border-blue-600 -mt-px bg-blue-50'
                : 'text-slate-500'
            }`}
          >
            Map
          </button>
          <button
            onClick={() => setMobileTab('info')}
            className={`flex-1 py-3 text-xs font-semibold transition-colors flex items-center justify-center gap-1 ${
              mobileTab === 'info'
                ? 'text-blue-600 border-t-2 border-blue-600 -mt-px bg-blue-50'
                : 'text-slate-500'
            }`}
          >
            {selectedAddress ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Risk Info
              </>
            ) : (
              'Search & Layers'
            )}
          </button>
        </div>

        {/* Mobile info panel — shown when info tab active */}
        {mobileTab === 'info' && (
          <div className="h-72 overflow-y-auto bg-slate-50 border-t border-slate-200">
            <Sidebar />
          </div>
        )}
      </div>

      {/* Map is always visible on mobile — tabs just toggle the info panel below */}
      {/* On mobile, the map is in the flex-1 main area above the bottom tabs */}

      <InfoModal />
    </div>
  )
}
