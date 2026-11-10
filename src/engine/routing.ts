import type { Location, RouteStep } from '../types';
import { cumulativeDistances, type LngLat } from './geo';

/**
 * FOSSGIS runs OSRM with a real bicycle profile. The OSRM demo server
 * (router.project-osrm.org) only hosts the car profile and answers with a
 * driving route whatever profile the URL names, so it is kept purely as a
 * last resort and flagged when used.
 */
const BIKE_ROUTER = 'https://routing.openstreetmap.de/routed-bike/route/v1/bike';
const CAR_ROUTER = 'https://router.project-osrm.org/route/v1/driving';

interface OsrmStep {
  distance: number;
  name: string;
  ref?: string;
  mode: string;
}
interface OsrmResponse {
  code: string;
  routes?: {
    distance: number;
    geometry: { coordinates: LngLat[] };
    legs: { steps: OsrmStep[] }[];
  }[];
}

export interface FetchedRoute {
  coordinates: LngLat[];
  cum: Float64Array;
  distance: number;
  steps: RouteStep[];
  drivingFallback: boolean;
}

export class RouteError extends Error {}

async function request(base: string, start: Location, end: Location, signal?: AbortSignal) {
  const url = `${base}/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&steps=true`;
  const timeout = AbortSignal.timeout(12000);
  const res = await fetch(url, { signal: signal ? AbortSignal.any([signal, timeout]) : timeout });
  if (!res.ok) throw new Error(`Router answered ${res.status}`);
  const data = (await res.json()) as OsrmResponse;
  if (data.code !== 'Ok' || !data.routes?.length) {
    throw new RouteError('No cycling route found between those two places.');
  }
  return data.routes[0];
}

export async function fetchRoute(
  start: Location,
  end: Location,
  signal?: AbortSignal
): Promise<FetchedRoute> {
  let route;
  let drivingFallback = false;
  try {
    route = await request(BIKE_ROUTER, start, end, signal);
  } catch (err) {
    if (err instanceof RouteError || signal?.aborted) throw err;
    try {
      route = await request(CAR_ROUTER, start, end, signal);
      drivingFallback = true;
    } catch (fallbackErr) {
      if (fallbackErr instanceof RouteError || signal?.aborted) throw fallbackErr;
      throw new RouteError('The routing service is not responding. Try again in a moment.');
    }
  }

  const coordinates = route.geometry.coordinates;
  if (coordinates.length < 2) throw new RouteError('Those two places are too close together.');
  const cum = cumulativeDistances(coordinates);
  const distance = cum[cum.length - 1];
  return {
    coordinates,
    cum,
    distance,
    steps: toSteps(route.legs.flatMap((l) => l.steps), distance, route.distance),
    drivingFallback,
  };
}

/** Collapse OSRM's turn-by-turn steps into stretches along named streets. */
export function toSteps(osrm: OsrmStep[], distance: number, routerDistance: number): RouteStep[] {
  // The router's own total differs slightly from the summed geometry; rescale to match.
  const scale = routerDistance > 0 ? distance / routerDistance : 1;
  const steps: RouteStep[] = [];
  let at = 0;
  for (const s of osrm) {
    const len = s.distance * scale;
    if (len <= 0) continue;
    const name = s.name || s.ref || '';
    const walk = s.mode === 'pushing bike' || s.mode === 'walking';
    const last = steps[steps.length - 1];
    if (last && last.name === name && last.walk === walk) last.to = at + len;
    else steps.push({ from: at, to: at + len, name, walk });
    at += len;
  }
  if (steps.length) steps[steps.length - 1].to = distance;
  return steps;
}

/** The street name at a point on the route, borrowing a neighbour's if this stretch is unnamed. */
export function streetAt(steps: RouteStep[], distance: number): string {
  const i = steps.findIndex((s) => distance >= s.from && distance < s.to);
  if (i < 0) return steps[steps.length - 1]?.name ?? '';
  if (steps[i].name) return steps[i].name;
  for (let k = 1; k < steps.length; k++) {
    const before = steps[i - k];
    const after = steps[i + k];
    // Only borrow from a stretch that is genuinely close by.
    if (after?.name && after.from - distance < 80) return after.name;
    if (before?.name && distance - before.to < 80) return before.name;
    if (!before && !after) break;
  }
  return '';
}
