import { useEffect, useRef, useCallback } from 'react'
import Map, { NavigationControl, GeolocateControl } from 'react-map-gl/maplibre'
import type { MapRef } from 'react-map-gl/maplibre'
import { useMapStore } from '@/store/mapStore'
import { FloodLayers } from './FloodLayers'
import { AddressMarker } from './AddressMarker'
import { FloodZoneLegend } from './FloodZoneLegend'
import { loadGeoData } from '@/lib/floodZones'
import { NYC_MAX_BOUNDS, MAP_STYLE } from '@/lib/constants'

export function FloodMap() {
  const mapRef = useRef<MapRef>(null)
  const { viewport, setViewport, setGeodataLoaded, selectedAddress } = useMapStore()

  useEffect(() => {
    loadGeoData().then(() => setGeodataLoaded(true))
  }, [setGeodataLoaded])

  // Fly to address when selected
  useEffect(() => {
    if (!selectedAddress || !mapRef.current) return
    const [lng, lat] = selectedAddress.coordinates
    mapRef.current.flyTo({ center: [lng, lat], zoom: 15, duration: 1200 })
  }, [selectedAddress])

  const handleMove = useCallback((evt: { viewState: typeof viewport }) => {
    setViewport(evt.viewState)
  }, [setViewport])

  return (
    <div className="relative w-full h-full" id="main-content">
      <Map
        ref={mapRef}
        {...viewport}
        onMove={handleMove}
        mapStyle={MAP_STYLE}
        maxBounds={NYC_MAX_BOUNDS}
        minZoom={9}
        maxZoom={18}
        style={{ width: '100%', height: '100%' }}
        aria-label="NYC Flood Risk Map"
        attributionControl={true}
      >
        <NavigationControl position="bottom-right" />
        <GeolocateControl
          position="bottom-right"
          trackUserLocation={false}
          positionOptions={{ enableHighAccuracy: true }}
        />

        <FloodLayers />
        <AddressMarker />
      </Map>

      <FloodZoneLegend />
    </div>
  )
}
