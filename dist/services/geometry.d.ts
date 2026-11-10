import { InterpolatedPosition, RouteSegment, TrafficLight } from '../types';

export declare function createRouteSegments(coordinates: [number, number][], trafficLights: TrafficLight[]): RouteSegment[];
export declare function calculateTravelTime(distance: number, startFromStop: boolean, endAtStop: boolean): number;
export declare function interpolatePosition(coordinates: [number, number][], distanceTraveled: number, cumulativeDistances: number[]): InterpolatedPosition;
export declare function calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): number;
export declare function calculateCurrentSpeed(distanceFromSegmentStart: number, segmentDistance: number, isStartingFromStop: boolean, isStoppingAtEnd: boolean): number;
//# sourceMappingURL=geometry.d.ts.map