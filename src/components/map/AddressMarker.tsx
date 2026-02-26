import { Marker } from 'react-map-gl/maplibre'
import { useMapStore } from '@/store/mapStore'
import { RISK_COLORS } from '@/lib/constants'

export function AddressMarker() {
  const { selectedAddress, floodResult } = useMapStore()

  if (!selectedAddress) return null

  const [lng, lat] = selectedAddress.coordinates
  const riskLevel = floodResult?.riskLevel ?? 'unknown'
  const color = RISK_COLORS[riskLevel]

  return (
    <Marker longitude={lng} latitude={lat} anchor="center">
      <div className="relative flex items-center justify-center" style={{ width: 40, height: 40 }}>
        {/* Pulse ring */}
        <div
          className="address-marker-pulse absolute rounded-full"
          style={{
            width: 32,
            height: 32,
            background: color,
            opacity: 0.3,
          }}
        />
        {/* Center dot */}
        <div
          className="relative rounded-full border-2 border-white shadow-lg"
          style={{
            width: 18,
            height: 18,
            background: color,
            boxShadow: `0 0 0 3px ${color}40`,
          }}
        />
      </div>
    </Marker>
  )
}
