/** Geometry helpers. Route coordinates are [lng, lat] pairs, as OSRM returns them. */
export type LngLat = [number, number];
export declare function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number;
export declare function bearing(lat1: number, lng1: number, lat2: number, lng2: number): number;
/** Smallest absolute difference between two bearings, 0-180. */
export declare function angleBetween(a: number, b: number): number;
/** Running distance in metres at every vertex of a line. */
export declare function cumulativeDistances(coords: LngLat[]): Float64Array;
/** Index of the segment containing `distance` (binary search over cumulative distances). */
export declare function segmentAt(cum: ArrayLike<number>, distance: number): number;
export interface PointOnRoute {
    lat: number;
    lng: number;
    bearing: number;
}
export declare function pointAt(coords: LngLat[], cum: ArrayLike<number>, distance: number): PointOnRoute;
export interface Projection {
    /** Distance from the point to the line, metres. */
    offset: number;
    /** Distance along the line of the closest point, metres. */
    along: number;
    /** Bearing of the line at that point. */
    bearing: number;
}
/**
 * Every place where a point comes within `maxOffset` metres of the line.
 * A route can pass the same spot twice, so this returns one projection per
 * separate approach rather than only the single nearest point.
 */
export declare function projectOntoLine(lat: number, lng: number, coords: LngLat[], cum: ArrayLike<number>, maxOffset: number, from?: number, to?: number): Projection[];
/** Ray-casting point-in-polygon test; polygon is a ring of [lng, lat]. */
export declare function inPolygon(lng: number, lat: number, ring: LngLat[]): boolean;
/** Bounding box as [[minLat, minLng], [maxLat, maxLng]]. */
export declare function boundsOf(coords: LngLat[]): [[number, number], [number, number]] | null;
