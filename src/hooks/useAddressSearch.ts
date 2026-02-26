import { useState, useEffect, useRef, useCallback } from 'react'
import { autocomplete } from '@/lib/geocoder'
import type { SearchResult } from '@/types/geocoder'

export function useAddressSearch() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.trim().length < 3) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        const results = await autocomplete(query)
        setSuggestions(results)
        setIsOpen(results.length > 0)
      } catch {
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  const clear = useCallback(() => {
    setQuery('')
    setSuggestions([])
    setIsOpen(false)
  }, [])

  return { query, setQuery, suggestions, isLoading, isOpen, setIsOpen, clear }
}
