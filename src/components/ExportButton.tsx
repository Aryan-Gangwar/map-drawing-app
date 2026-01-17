import L from 'leaflet'
import type { FeatureCollection } from 'geojson'

type Props = {
  featureGroupRef: React.RefObject<L.FeatureGroup>
}

export default function ExportButton({ featureGroupRef }: Props) {
  const exportGeoJSON = () => {
    if (!featureGroupRef.current) return

    const features: any[] = []

    featureGroupRef.current.eachLayer(layer => {
      // ✅ TYPE CAST FIX
      const geoLayer = layer as L.Layer & {
        toGeoJSON?: () => any
      }

      if (geoLayer.toGeoJSON) {
        features.push(geoLayer.toGeoJSON())
      }
    })

    const geojson: FeatureCollection = {
      type: 'FeatureCollection',
      features
    }

    const blob = new Blob([JSON.stringify(geojson, null, 2)], {
      type: 'application/json'
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'map-features.geojson'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button className="export-btn" onClick={exportGeoJSON}>
      ⬇ Export GeoJSON
    </button>
  )
}
