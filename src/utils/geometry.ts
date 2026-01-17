import * as turf from '@turf/turf'
import type { Feature, Polygon } from 'geojson'
import L from 'leaflet'

/* ===============================
   Leaflet → Polygon
================================ */
export function normalizeToPolygon(
  layer: any
): Feature<Polygon> | null {

  if (layer instanceof L.Circle) {
    const c = layer.getLatLng()
    return turf.circle(
      [c.lng, c.lat],
      layer.getRadius() / 1000,
      { steps: 64, units: 'kilometers' }
    ) as Feature<Polygon>
  }

  if (layer instanceof L.Polygon) {
    return layer.toGeoJSON() as Feature<Polygon>
  }

  return null
}

/* ===============================
   Polygon Rules
================================ */
export function applyPolygonRules(
  newPoly: Feature<Polygon>,
  existing: Feature<Polygon>[]
): Feature<Polygon> | null {

  let result = newPoly

  for (const old of existing) {

    // ❌ ENCLOSING / INSIDE → BLOCK
    if (
      turf.booleanContains(old, result) ||
      turf.booleanContains(result, old)
    ) {
      return null
    }

    // ⛔ No overlap
    if (!turf.booleanIntersects(result, old)) continue

    // ✂️ REAL OVERLAP → TRIM
    const diff = turf.difference(result, old)
    if (!diff) return null

    if (diff.geometry.type === 'MultiPolygon') {
      result = diff.geometry.coordinates
        .map(c => turf.polygon(c))
        .sort((a, b) => turf.area(b) - turf.area(a))[0]
    } else {
      result = diff as Feature<Polygon>
    }
  }

  return result
}
