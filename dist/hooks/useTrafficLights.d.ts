import { TrafficLight } from '../types';

interface UseTrafficLightsResult {
    trafficLights: TrafficLight[];
    isLoading: boolean;
    error: string | null;
}
export declare function useTrafficLights(coordinates: [number, number][]): UseTrafficLightsResult;
export {};
//# sourceMappingURL=useTrafficLights.d.ts.map