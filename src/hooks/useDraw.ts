import { useState } from 'react'
import type { Feature } from 'geojson'

export function useDraw() {
  const [features, setFeatures] = useState<Feature[]>([])

  const addFeature = (feature: Feature) => {
    setFeatures(prev => [...prev, feature])
  }

  return {
    features,
    addFeature
  }
}
