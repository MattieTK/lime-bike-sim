import { SimulationState, TrafficLight, InterpolatedPosition } from '../types';

interface UseSimulationProps {
    coordinates: [number, number][];
    cumulativeDistances: number[];
    trafficLights: TrafficLight[];
    totalDistance: number;
    simulationSpeed: number;
    minWaitTime: number;
    maxWaitTime: number;
}
interface UseSimulationResult {
    state: SimulationState;
    position: InterpolatedPosition | null;
    play: () => void;
    pause: () => void;
    reset: () => void;
    isReady: boolean;
}
export declare function useSimulation({ coordinates, cumulativeDistances, trafficLights, totalDistance, simulationSpeed, minWaitTime, maxWaitTime, }: UseSimulationProps): UseSimulationResult;
export {};
//# sourceMappingURL=useSimulation.d.ts.map