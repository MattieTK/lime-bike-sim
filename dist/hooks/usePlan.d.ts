import type { Location, PrecomputedRoute, RoutePlan } from '../types';
export interface PlanState {
    plan: RoutePlan | null;
    loading: boolean;
    error: string | null;
}
/** Loads the route and its traffic lights whenever the two ends change. */
export declare function usePlan(start: Location | undefined, end: Location | undefined, precomputed: PrecomputedRoute | undefined): PlanState;
