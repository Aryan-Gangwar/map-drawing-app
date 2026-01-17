import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet-control-geocoder'

const INITIAL_CENTER: [number, number] = [28.61, 77.23]
const INITIAL_ZOOM = 6

export default function SearchControl() {
  const map = useMap()

  useEffect(() => {
    const geocoder = (L.Control as any).geocoder({
      position: 'topleft',
      placeholder: 'Search location...',
      collapsed: false,

      // 🔥 MOST IMPORTANT FIX
      defaultMarkGeocode: false,
    })

    geocoder.addTo(map)

    let marker: L.Marker | null = null

    // when search result found
    geocoder.on('markgeocode', (e: any) => {
      // remove old marker
      if (marker) map.removeLayer(marker)

      // add fresh marker (NO popup / NO label)
      marker = L.marker(e.geocode.center, {
        interactive: false,
      }).addTo(map)

      map.fitBounds(e.geocode.bbox)
    })

    // 🔥 clear behaviour (cross click)
    setTimeout(() => {
      const input = document.querySelector(
        '.leaflet-control-geocoder input'
      ) as HTMLInputElement

      if (!input) return

      input.addEventListener('input', () => {
        if (input.value === '') {
          // remove marker
          if (marker) {
            map.removeLayer(marker)
            marker = null
          }

          // reset map
          map.setView(INITIAL_CENTER, INITIAL_ZOOM)
        }
      })
    }, 300)

    return () => {
      map.removeControl(geocoder)
    }
  }, [map])

  return null
}
