import type { RouteSignal, Traffic } from '../types';
/**
 * A fixed-time signal plan as one approach sees it, in the UK sequence:
 * green → amber → red → red+amber → green.
 *
 * Real London signals are mostly adaptive (SCOOT) and their timings are not
 * published, so each light gets a plausible plan drawn from typical ranges.
 * The plan is derived from the light's identity, so the same light behaves the
 * same way on every ride; only the moment you arrive in its cycle changes.
 */
export interface SignalPlan {
    cycle: number;
    green: number;
    amber: number;
    redAmber: number;
}
export type Phase = 'green' | 'amber' | 'red' | 'redAmber';
export declare function planFor(signal: Pick<RouteSignal, 'id' | 'kind'>, traffic: Traffic): SignalPlan;
/** Phase shown at `time` seconds, for a light whose cycle started `offset` seconds before the ride. */
export declare function phaseAt(plan: SignalPlan, time: number, offset: number): Phase;
/** Chance of arriving at anything other than green. */
export declare function stopChance(plan: SignalPlan): number;
