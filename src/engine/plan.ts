import type { Location, PrecomputedRoute, RoutePlan } from '../types';
import { cumulativeDistances, type LngLat } from './geo';
import { fetchRoute } from './routing';
import { findSignals } from './signals';

/** Look up a cycling route and the traffic lights along it. */
export async function buildPlan(
  start: Location,
  end: Location,
  signal?: AbortSignal
): Promise<RoutePlan> {
  const route = await fetchRoute(start, end, signal);
  const found = await findSignals(route.coordinates, route.cum, route.steps, signal);
  return {
    coordinates: route.coordinates,
    cum: route.cum,
    distance: route.distance,
    steps: route.steps,
    signals: found.signals,
    signalSource: found.source,
    drivingFallback: route.drivingFallback,
  };
}

/** Turn route data shipped by the host page into a plan, with no network requests. */
export function planFromPrecomputed(data: PrecomputedRoute): RoutePlan {
  const coordinates = data.coordinates as LngLat[];
  const cum = cumulativeDistances(coordinates);
  const distance = cum[cum.length - 1] ?? 0;
  // Light positions were measured against the provider's distance; rescale to ours.
  const scale = data.distance > 0 ? distance / data.distance : 1;
  const signals = data.trafficLights
    .map((light) => ({
      id: light.id,
      lat: light.lat,
      lng: light.lng,
      distance: light.distanceFromStart * scale,
      kind: light.kind ?? ('junction' as const),
      name: light.name ?? '',
    }))
    .filter((s) => s.distance > 8 && s.distance < distance - 8)
    .sort((a, b) => a.distance - b.distance);
  return {
    coordinates,
    cum,
    distance,
    steps: data.steps ?? [{ from: 0, to: distance, name: '', walk: false }],
    signals,
    signalSource: 'precomputed',
    drivingFallback: false,
  };
}

/** The reverse: a plan as JSON a host page can ship. */
export function toPrecomputed(plan: RoutePlan): PrecomputedRoute {
  const round = (n: number) => Math.round(n * 10) / 10;
  return {
    coordinates: plan.coordinates,
    distance: round(plan.distance),
    trafficLights: plan.signals.map((s) => ({
      id: s.id,
      lat: s.lat,
      lng: s.lng,
      distanceFromStart: round(s.distance),
      kind: s.kind,
      name: s.name,
    })),
    steps: plan.steps.map((s) => ({ ...s, from: round(s.from), to: round(s.to) })),
  };
}
