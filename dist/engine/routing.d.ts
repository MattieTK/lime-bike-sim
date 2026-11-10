import type { Location, RouteStep } from '../types';
import { type LngLat } from './geo';
interface OsrmStep {
    distance: number;
    name: string;
    ref?: string;
    mode: string;
}
export interface FetchedRoute {
    coordinates: LngLat[];
    cum: Float64Array;
    distance: number;
    steps: RouteStep[];
    drivingFallback: boolean;
}
export declare class RouteError extends Error {
}
export declare function fetchRoute(start: Location, end: Location, signal?: AbortSignal): Promise<FetchedRoute>;
/** Collapse OSRM's turn-by-turn steps into stretches along named streets. */
export declare function toSteps(osrm: OsrmStep[], distance: number, routerDistance: number): RouteStep[];
/** The street name at a point on the route, borrowing a neighbour's if this stretch is unnamed. */
export declare function streetAt(steps: RouteStep[], distance: number): string;
export {};
