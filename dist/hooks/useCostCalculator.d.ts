import { CostBreakdown, SimulationState } from '../types';

interface UseCostCalculatorProps {
    state: SimulationState;
    totalDistance: number;
    unlockFee: number;
    perMinuteRate: number;
}
export declare function useCostCalculator({ state, totalDistance, unlockFee, perMinuteRate, }: UseCostCalculatorProps): CostBreakdown;
export declare function calculateProjectedCost(currentElapsedTime: number, remainingDistance: number, remainingTrafficLights: number, averageWaitTime: number, unlockFee: number, perMinuteRate: number): number;
export {};
//# sourceMappingURL=useCostCalculator.d.ts.map