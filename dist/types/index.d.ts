import { LatLngExpression } from 'leaflet';

export interface Location {
    lat: number;
    lng: number;
    label?: string;
}
export declare const BIKE_PHYSICS: {
    readonly MAX_SPEED_MPH: 15;
    readonly MAX_SPEED_KMH: 24.14;
    readonly MAX_SPEED_MS: 6.7056;
    readonly ACCELERATION_TIME: 5;
    readonly BRAKING_TIME: 3;
    readonly ACCELERATION_RATE: 1.341;
    readonly DECELERATION_RATE: 2.235;
};
export interface LimeBikeSimulatorProps {
    startLocation?: Location;
    endLocation?: Location;
    unlockFee?: number;
    perMinuteRate?: number;
    simulationSpeed?: number;
    minWaitTime?: number;
    maxWaitTime?: number;
    width?: string | number;
    height?: string | number;
    showControls?: boolean;
    allowLocationPicker?: boolean;
}
export interface RouteStep {
    distance: number;
    duration: number;
    geometry: {
        coordinates: [number, number][];
    };
    name: string;
}
export interface Route {
    distance: number;
    duration: number;
    geometry: {
        type: 'LineString';
        coordinates: [number, number][];
    };
    legs: {
        steps: RouteStep[];
    }[];
}
export interface OSRMResponse {
    code: string;
    routes: Route[];
}
export interface TrafficLight {
    id: number;
    lat: number;
    lng: number;
    routeIndex: number;
    distanceFromStart: number;
}
export interface OverpassNode {
    type: 'node';
    id: number;
    lat: number;
    lon: number;
    tags?: Record<string, string>;
}
export interface OverpassResponse {
    elements: OverpassNode[];
}
export type SimulationStatus = 'idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'finished';
export interface SimulationState {
    status: SimulationStatus;
    currentPosition: LatLngExpression;
    currentSpeed: number;
    elapsedTime: number;
    distanceTraveled: number;
    routeProgress: number;
    currentTrafficLightIndex: number;
    isWaitingAtLight: boolean;
    currentWaitTime: number;
    totalWaitTime: number;
    lightsEncountered: number;
}
export interface CostBreakdown {
    unlockFee: number;
    ridingCost: number;
    waitingCost: number;
    totalCost: number;
    idealCost: number;
    wastedMoney: number;
}
export interface RouteSegment {
    startIndex: number;
    endIndex: number;
    coordinates: [number, number][];
    distance: number;
    hasTrafficLightAtEnd: boolean;
    trafficLightId?: number;
}
export interface InterpolatedPosition {
    lat: number;
    lng: number;
    bearing: number;
    segmentIndex: number;
}
//# sourceMappingURL=index.d.ts.map