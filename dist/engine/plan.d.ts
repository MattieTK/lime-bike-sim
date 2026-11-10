import type { Location, PrecomputedRoute, RoutePlan } from '../types';
/** Look up a cycling route and the traffic lights along it. */
export declare function buildPlan(start: Location, end: Location, signal?: AbortSignal): Promise<RoutePlan>;
/** Turn route data shipped by the host page into a plan, with no network requests. */
export declare function planFromPrecomputed(data: PrecomputedRoute): RoutePlan;
/** The reverse: a plan as JSON a host page can ship. */
export declare function toPrecomputed(plan: RoutePlan): PrecomputedRoute;
