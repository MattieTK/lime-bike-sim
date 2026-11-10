/** Geometry helpers. Route coordinates are [lng, lat] pairs, as OSRM returns them. */

export type LngLat = [number, number];

const R = 6371000;
const rad = (d: number) => (d * Math.PI) / 180;

export function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function bearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const y = Math.sin(rad(lng2 - lng1)) * Math.cos(rad(lat2));
  const x =
    Math.cos(rad(lat1)) * Math.sin(rad(lat2)) -
    Math.sin(rad(lat1)) * Math.cos(rad(lat2)) * Math.cos(rad(lng2 - lng1));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** Smallest absolute difference between two bearings, 0-180. */
export function angleBetween(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}

/** Running distance in metres at every vertex of a line. */
export function cumulativeDistances(coords: LngLat[]): Float64Array {
  const out = new Float64Array(coords.length);
  for (let i = 1; i < coords.length; i++) {
    out[i] = out[i - 1] + haversine(coords[i - 1][1], coords[i - 1][0], coords[i][1], coords[i][0]);
  }
  return out;
}

/** Index of the segment containing `distance` (binary search over cumulative distances). */
export function segmentAt(cum: ArrayLike<number>, distance: number): number {
  let lo = 0;
  let hi = cum.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] <= distance) lo = mid;
    else hi = mid;
  }
  return lo;
}

export interface PointOnRoute {
  lat: number;
  lng: number;
  bearing: number;
}

export function pointAt(coords: LngLat[], cum: ArrayLike<number>, distance: number): PointOnRoute {
  if (coords.length === 0) return { lat: 0, lng: 0, bearing: 0 };
  if (coords.length === 1) return { lat: coords[0][1], lng: coords[0][0], bearing: 0 };
  const d = Math.max(0, Math.min(distance, cum[cum.length - 1]));
  const i = segmentAt(cum, d);
  const len = cum[i + 1] - cum[i];
  const t = len > 0 ? (d - cum[i]) / len : 0;
  const [x1, y1] = coords[i];
  const [x2, y2] = coords[i + 1];
  return {
    lat: y1 + (y2 - y1) * t,
    lng: x1 + (x2 - x1) * t,
    bearing: bearing(y1, x1, y2, x2),
  };
}

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
export function projectOntoLine(
  lat: number,
  lng: number,
  coords: LngLat[],
  cum: ArrayLike<number>,
  maxOffset: number,
  from = 0,
  to = coords.length - 1
): Projection[] {
  const kx = Math.cos(rad(lat)) * 111320;
  const ky = 110540;
  const hits: Projection[] = [];
  let best: Projection | null = null;
  for (let i = from; i < to; i++) {
    const ax = (coords[i][0] - lng) * kx;
    const ay = (coords[i][1] - lat) * ky;
    const bx = (coords[i + 1][0] - lng) * kx;
    const by = (coords[i + 1][1] - lat) * ky;
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    const t = len2 > 0 ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / len2)) : 0;
    const offset = Math.hypot(ax + dx * t, ay + dy * t);
    if (offset <= maxOffset) {
      const along = cum[i] + (cum[i + 1] - cum[i]) * t;
      const hit = {
        offset,
        along,
        bearing: bearing(coords[i][1], coords[i][0], coords[i + 1][1], coords[i + 1][0]),
      };
      // Merge with the current approach unless we have clearly moved on along the route.
      if (best && along - best.along < 60) {
        if (offset < best.offset) best = hit;
      } else {
        if (best) hits.push(best);
        best = hit;
      }
    }
  }
  if (best) hits.push(best);
  return hits;
}

/** Ray-casting point-in-polygon test; polygon is a ring of [lng, lat]. */
export function inPolygon(lng: number, lat: number, ring: LngLat[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > lat !== yj > lat && lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Bounding box as [[minLat, minLng], [maxLat, maxLng]]. */
export function boundsOf(coords: LngLat[]): [[number, number], [number, number]] | null {
  if (coords.length === 0) return null;
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;
  for (const [lng, lat] of coords) {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  }
  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
}
