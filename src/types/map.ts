import type { Feature, Polygon, LineString } from 'geojson'

export type PolygonFeature = Feature<Polygon>
export type LineFeature = Feature<LineString>

export type MapFeature = PolygonFeature | LineFeature
