import { useMapStore } from '@/store/mapStore'

export function Header() {
  const setIsInfoOpen = useMapStore((s) => s.setIsInfoOpen)

  return (
    <header className="h-14 flex items-center justify-between px-4 bg-white border-b border-slate-200 z-20 flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <img src="/favicon.svg" alt="" className="w-7 h-7" />
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight">NYC Flood Risk</h1>
          <p className="text-xs text-slate-400 leading-tight hidden sm:block">Stormwater & Coastal Flooding</p>
        </div>
      </div>

      <button
        onClick={() => setIsInfoOpen(true)}
        className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors px-2 py-1.5 rounded-lg hover:bg-blue-50"
        aria-label="About this map"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="hidden sm:inline">About</span>
      </button>
    </header>
  )
}
