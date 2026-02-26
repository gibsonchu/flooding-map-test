import { STORMWATER_COLORS, FEMA_COLORS, EVAC_COLORS } from './constants'
import type { FillLayerSpecification, LineLayerSpecification } from 'maplibre-gl'

export const stormwaterExtremeLayer: Omit<FillLayerSpecification, 'id' | 'source'> = {
  type: 'fill',
  paint: {
    'fill-color': STORMWATER_COLORS.extreme,
    'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.85, 0.6],
  },
}

export const stormwaterModeratLayer: Omit<FillLayerSpecification, 'id' | 'source'> = {
  type: 'fill',
  paint: {
    'fill-color': STORMWATER_COLORS.moderate,
    'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.85, 0.5],
  },
}

export const stormwaterLimitedLayer: Omit<FillLayerSpecification, 'id' | 'source'> = {
  type: 'fill',
  paint: {
    'fill-color': STORMWATER_COLORS.limited,
    'fill-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 0.85, 0.4],
  },
}

export const femaFillLayer: Omit<FillLayerSpecification, 'id' | 'source'> = {
  type: 'fill',
  paint: {
    'fill-color': [
      'match',
      ['get', 'FLD_ZONE'],
      'VE', FEMA_COLORS.VE,
      'AE', FEMA_COLORS.AE,
      'AO', FEMA_COLORS.AO,
      'A', FEMA_COLORS.A,
      'X', FEMA_COLORS.X,
      '#e2e8f0',
    ],
    'fill-opacity': 0.55,
  },
}

export const femaOutlineLayer: Omit<LineLayerSpecification, 'id' | 'source'> = {
  type: 'line',
  paint: {
    'line-color': '#7c3aed',
    'line-width': 0.8,
    'line-opacity': 0.7,
  },
}

export const evacuationFillLayer: Omit<FillLayerSpecification, 'id' | 'source'> = {
  type: 'fill',
  paint: {
    'fill-color': [
      'match',
      ['get', 'hurricane_evacuation_zone'],
      '1', EVAC_COLORS['1'],
      '2', EVAC_COLORS['2'],
      '3', EVAC_COLORS['3'],
      '4', EVAC_COLORS['4'],
      '5', EVAC_COLORS['5'],
      '6', EVAC_COLORS['6'],
      EVAC_COLORS['X'],
    ],
    'fill-opacity': 0.35,
  },
}

export const fviChoroplethLayer: Omit<FillLayerSpecification, 'id' | 'source'> = {
  type: 'fill',
  paint: {
    'fill-color': [
      'interpolate',
      ['linear'],
      ['to-number', ['coalesce', ['get', 'fshri'], '0']],
      0, '#e2e8f0',
      1, '#f0fdf4',
      2, '#86efac',
      3, '#facc15',
      4, '#f97316',
      5, '#dc2626',
    ],
    'fill-opacity': 0.65,
  },
}

export const fviOutlineLayer: Omit<LineLayerSpecification, 'id' | 'source'> = {
  type: 'line',
  paint: {
    'line-color': '#94a3b8',
    'line-width': 0.5,
    'line-opacity': 0.5,
  },
}
