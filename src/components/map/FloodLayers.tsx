import { Source, Layer } from 'react-map-gl/maplibre'
import { useMapStore } from '@/store/mapStore'
import {
  stormwaterExtremeLayer,
  stormwaterModeratLayer,
  stormwaterLimitedLayer,
  evacuationFillLayer,
  fviChoroplethLayer,
  fviOutlineLayer,
} from '@/lib/layerStyles'
import { GEOJSON_PATHS, FEMA_WMS_URL } from '@/lib/constants'

export function FloodLayers() {
  const { layerVisibility } = useMapStore()

  return (
    <>
      {/* Stormwater — Limited (current sea levels, lowest risk shown first) */}
      {layerVisibility.stormwaterLimited && (
        <Source id="stormwater-limited" type="geojson" data={GEOJSON_PATHS.stormwaterLimited}>
          <Layer id="stormwater-limited-fill" {...stormwaterLimitedLayer} />
        </Source>
      )}

      {/* Stormwater — Moderate (2050 SLR) */}
      {layerVisibility.stormwaterModerate && (
        <Source id="stormwater-moderate" type="geojson" data={GEOJSON_PATHS.stormwaterModerate}>
          <Layer id="stormwater-moderate-fill" {...stormwaterModeratLayer} />
        </Source>
      )}

      {/* Stormwater — Extreme (2080 SLR, shown on top) */}
      {layerVisibility.stormwaterExtreme && (
        <Source id="stormwater-extreme" type="geojson" data={GEOJSON_PATHS.stormwaterExtreme}>
          <Layer id="stormwater-extreme-fill" {...stormwaterExtremeLayer} />
        </Source>
      )}

      {/* FEMA Flood Zones — WMS raster overlay */}
      {layerVisibility.femaZones && (
        <Source
          id="fema-wms"
          type="raster"
          tiles={[
            `${FEMA_WMS_URL}?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=0&CRS=EPSG%3A3857&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}`,
          ]}
          tileSize={256}
          attribution="FEMA National Flood Hazard Layer"
        >
          <Layer
            id="fema-zones-raster"
            type="raster"
            paint={{ 'raster-opacity': 0.6 }}
          />
        </Source>
      )}

      {/* Hurricane Evacuation Zones */}
      {layerVisibility.evacuationZones && (
        <Source id="evac-zones" type="geojson" data={GEOJSON_PATHS.evacuationZones}>
          <Layer id="evac-zones-fill" {...evacuationFillLayer} />
        </Source>
      )}

      {/* Flood Vulnerability Index — NTA choropleth */}
      {layerVisibility.floodVulnerability && (
        <Source id="fvi" type="geojson" data={GEOJSON_PATHS.fviMap}>
          <Layer id="fvi-fill" {...fviChoroplethLayer} />
          <Layer id="fvi-outline" {...fviOutlineLayer} />
        </Source>
      )}
    </>
  )
}
