import { Location, Route } from '../types';

export declare function fetchRoute(start: Location, end: Location): Promise<Route>;
export declare function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number;
export declare function calculateCumulativeDistances(coordinates: [number, number][]): number[];
//# sourceMappingURL=osrm.d.ts.map