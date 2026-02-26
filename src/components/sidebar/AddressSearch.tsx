import { useRef, useEffect } from 'react'
import { useAddressSearch } from '@/hooks/useAddressSearch'
import { useFloodZoneLookup } from '@/hooks/useFloodZoneLookup'
import { useMapStore } from '@/store/mapStore'
import type { SearchResult } from '@/types/geocoder'

export function AddressSearch() {
  const { query, setQuery, suggestions, isLoading, isOpen, setIsOpen, clear } = useAddressSearch()
  const { analyze } = useFloodZoneLookup()
  const { selectedAddress, geodataLoaded } = useMapStore()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const handleSelect = (result: SearchResult) => {
    setQuery(result.label)
    setIsOpen(false)
    analyze(result)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
    if (e.key === 'Enter' && suggestions.length > 0) {
      handleSelect(suggestions[0])
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const first = listRef.current?.querySelector('button') as HTMLButtonElement | null
      first?.focus()
    }
  }

  const handleListKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleSelect(suggestions[index])
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const buttons = listRef.current?.querySelectorAll('button')
      if (buttons && index < buttons.length - 1) (buttons[index + 1] as HTMLButtonElement).focus()
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (index === 0) { inputRef.current?.focus(); return }
      const buttons = listRef.current?.querySelectorAll('button')
      if (buttons) (buttons[index - 1] as HTMLButtonElement).focus()
    }
    if (e.key === 'Escape') setIsOpen(false)
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        !inputRef.current?.parentElement?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [setIsOpen])

  return (
    <div className="relative">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-label="Search NYC address"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setIsOpen(true)}
          placeholder={geodataLoaded ? 'Search any NYC address...' : 'Loading flood data...'}
          disabled={!geodataLoaded}
          className="w-full pl-9 pr-8 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 shadow-sm"
        />
        {(query || selectedAddress) && (
          <button
            onClick={() => { clear(); useMapStore.getState().setSelectedAddress(null); useMapStore.getState().setFloodResult(null) }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label="Address suggestions"
          className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
        >
          {suggestions.map((result, i) => (
            <li key={`${result.label}-${i}`} role="option" aria-selected={false}>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(result)}
                onKeyDown={(e) => handleListKeyDown(e, i)}
                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors"
              >
                <div className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-slate-800 leading-tight">{result.label}</p>
                    {result.borough && (
                      <p className="text-xs text-slate-400 mt-0.5">{result.borough}</p>
                    )}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
