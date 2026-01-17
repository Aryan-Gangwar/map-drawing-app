import { MapContainer, TileLayer, FeatureGroup, ZoomControl } from 'react-leaflet'
import { EditControl } from 'react-leaflet-draw'
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import L from 'leaflet'
import { useRef, useState } from 'react'
import SearchControl from '../components/SearchControl'
import ExportButton from '../components/ExportButton'
import { SHAPE_LIMITS } from '../utils/limits'
import {
  normalizeToPolygon,
  applyPolygonRules
} from '../utils/geometry'

const center: [number, number] = [28.61, 77.23]

export default function MapView() {
  const fgRef = useRef<L.FeatureGroup>(null)
  const [error, setError] = useState<string | null>(null)

  const onCreated = (e: any) => {
    const layer = e.layer
    const type = e.layerType

    // 🔢 COUNT EXISTING SHAPES
  let count = 0
  fgRef.current?.eachLayer(l => {
    if (
      type === 'polygon' && l instanceof L.Polygon && !(l instanceof L.Rectangle)
    ) count++

    if (type === 'rectangle' && l instanceof L.Rectangle) count++

    if (type === 'circle' && l instanceof L.Circle) count++

    if (type === 'polyline' && l instanceof L.Polyline && !(l instanceof L.Polygon))
      count++
  })

  // ❌ LIMIT EXCEEDED → BLOCK
  if (count >= SHAPE_LIMITS[type]) {
    setError(`Maximum ${SHAPE_LIMITS[type]} ${type}s allowed`)
    return
  }

    // LineString → NO RULES
    if (type === 'polyline') {
      fgRef.current?.addLayer(layer)
      return
    }

    // TEMP ADD FIRST
    fgRef.current?.addLayer(layer)

    const newPolygon = normalizeToPolygon(layer)
    if (!newPolygon) return

    const existing: any[] = []

    fgRef.current?.eachLayer(l => {
      if (
        l !== layer &&
        (l instanceof L.Polygon || l instanceof L.Circle)
      ) {
        const poly = normalizeToPolygon(l)
        if (poly) existing.push(poly)
      }
    })

    try {
      const finalPolygon = applyPolygonRules(newPolygon, existing)

      // ❌ BLOCK CASE
      if (!finalPolygon) {
        fgRef.current?.removeLayer(layer)
        setError('Polygon inside another polygon is not allowed')
        return
      }

      // ✂️ TRIM CASE
      if (finalPolygon !== newPolygon) {
        fgRef.current?.removeLayer(layer)
        L.geoJSON(finalPolygon).eachLayer(l =>
          fgRef.current?.addLayer(l)
        )
      }

    } catch (err: any) {
      fgRef.current?.removeLayer(layer)
      setError(err.message)
    }
  }

  return (
    <div className="map-wrapper">
      <ExportButton featureGroupRef={fgRef} />
      <MapContainer
        center={center}
        zoom={6}
        zoomControl={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <SearchControl />
        <ZoomControl position="bottomright" />

        <FeatureGroup ref={fgRef}>
          <EditControl
            position="topright"
            onCreated={onCreated}
            draw={{
              polygon: true,
              rectangle: true,
              circle: true,
              polyline: true,
              marker: false,
              circlemarker: false
            }}
          />
        </FeatureGroup>
      </MapContainer>

      {/* ✅ MODAL */}
      {error && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <span className="modal-icon">⚠️</span>
              <span>Invalid Operation</span>
            </div>
            <div className="modal-body">{error}</div>
            <div className="modal-footer">
              <button onClick={() => setError(null)}>Okay</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
