import type { RoutePlan } from '../types';
import type { Ride } from '../engine/ride';
import { type SignalPlan } from '../engine/signalModel';
interface Props {
    plan: RoutePlan;
    ride: Ride;
    signalPlans: SignalPlan[];
    time: number;
    distance: number;
    onSeek: (distance: number) => void;
}
/**
 * The route laid out as a straight line: every set of lights in its live
 * colour, the rider's position, and a mark wherever a red made them stop.
 * Click or drag to jump to any point of the ride.
 */
export declare function RouteStrip({ plan, ride, signalPlans, time, distance, onSeek }: Props): import("react/jsx-runtime").JSX.Element;
export {};
