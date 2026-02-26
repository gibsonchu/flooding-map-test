import { create } from 'zustand'
import type { MapViewport, LayerVisibility, FloodZoneResult } from '@/types/flood'
import type { SearchResult } from '@/types/geocoder'
import { NYC_CENTER, NYC_DEFAULT_ZOOM } from '@/lib/constants'

interface MapState {
  viewport: MapViewport
  setViewport: (vp: Partial<MapViewport>) => void

  selectedAddress: SearchResult | null
  setSelectedAddress: (addr: SearchResult | null) => void

  floodResult: FloodZoneResult | null
  setFloodResult: (result: FloodZoneResult | null) => void

  isAnalyzing: boolean
  setIsAnalyzing: (v: boolean) => void

  layerVisibility: LayerVisibility
  toggleLayer: (key: keyof LayerVisibility) => void
  setLayerVisibility: (key: keyof LayerVisibility, value: boolean) => void

  isInfoOpen: boolean
  setIsInfoOpen: (v: boolean) => void

  geodataLoaded: boolean
  setGeodataLoaded: (v: boolean) => void
}

export const useMapStore = create<MapState>((set) => ({
  viewport: {
    longitude: NYC_CENTER[0],
    latitude: NYC_CENTER[1],
    zoom: NYC_DEFAULT_ZOOM,
    bearing: 0,
    pitch: 0,
  },
  setViewport: (vp) =>
    set((s) => ({ viewport: { ...s.viewport, ...vp } })),

  selectedAddress: null,
  setSelectedAddress: (addr) => set({ selectedAddress: addr }),

  floodResult: null,
  setFloodResult: (result) => set({ floodResult: result }),

  isAnalyzing: false,
  setIsAnalyzing: (v) => set({ isAnalyzing: v }),

  layerVisibility: {
    stormwaterExtreme: true,
    stormwaterModerate: false,
    stormwaterLimited: false,
    femaZones: false,
    evacuationZones: false,
    floodVulnerability: false,
  },
  toggleLayer: (key) =>
    set((s) => ({
      layerVisibility: {
        ...s.layerVisibility,
        [key]: !s.layerVisibility[key],
      },
    })),
  setLayerVisibility: (key, value) =>
    set((s) => ({
      layerVisibility: { ...s.layerVisibility, [key]: value },
    })),

  isInfoOpen: false,
  setIsInfoOpen: (v) => set({ isInfoOpen: v }),

  geodataLoaded: false,
  setGeodataLoaded: (v) => set({ geodataLoaded: v }),
}))
