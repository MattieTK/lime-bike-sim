import type { RouteSignal, RouteStep, SignalKind, SignalSource } from '../types';
import { type LngLat } from './geo';
/** A mapped signal node, before it is matched to a route. */
export interface SignalNode {
    lat: number;
    lng: number;
    kind: SignalKind;
    /** Direction of travel the signal applies to, degrees, or -1 for every approach. */
    bearing: number;
}
/**
 * Match mapped signal nodes to a route and merge them into the sets of lights
 * a rider would actually experience.
 */
export declare function matchSignals(nodes: SignalNode[], coordinates: LngLat[], cum: ArrayLike<number>, steps: RouteStep[]): RouteSignal[];
/**
 * Find the traffic lights along a route. Greater London comes from the bundled
 * OpenStreetMap extract; anywhere else is looked up live. If the live lookup
 * fails the source is reported as 'unavailable' rather than pretending the
 * route has no lights.
 */
export declare function findSignals(coordinates: LngLat[], cum: ArrayLike<number>, steps: RouteStep[], signal?: AbortSignal): Promise<{
    signals: RouteSignal[];
    source: SignalSource;
}>;
