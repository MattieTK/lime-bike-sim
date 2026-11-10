import type { Pace, RoutePlan, Traffic } from '../types';
import { type SignalPlan } from './signalModel';
export interface RideContext {
    plan: RoutePlan;
    pace: Pace;
    /** Highest speed the rider would choose at each grid point, already eased for braking. */
    limit: Float32Array;
    /** Where the delay caused by each light is measured: halfway to the next light. */
    checkpoints: number[];
    /** The ride with every light green. */
    freeFlow: {
        duration: number;
        checkpointTimes: number[];
        samples?: Samples;
    };
}
export interface Samples {
    t: Float32Array;
    s: Float32Array;
    v: Float32Array;
}
export interface Stop {
    /** Index into plan.signals. */
    signal: number;
    /** Seconds into the ride when the rider came to a halt. */
    at: number;
    /** Seconds spent stationary. */
    wait: number;
}
export interface Ride {
    seed: number;
    duration: number;
    /** Seconds added by lights compared with the free-flow ride. */
    delay: number;
    /** Seconds spent stationary at lights. */
    waiting: number;
    stops: Stop[];
    /** Seconds each light added, including braking and pulling away. */
    signalDelay: number[];
    /** Where each light is in its cycle at the moment of unlock. */
    offsets: number[];
    /** Time, distance and speed every DT seconds. Only present when recorded. */
    samples?: Samples;
}
export declare function createContext(plan: RoutePlan, pace: Pace): RideContext;
/** One ride. The seed decides where every light is in its cycle when you unlock. */
export declare function simulateRide(ctx: RideContext, traffic: Traffic, seed: number, record?: boolean): Ride;
export declare function signalPlans(ctx: RideContext, traffic: Traffic): SignalPlan[];
/** Distance and speed at a moment of a recorded ride. */
export declare function sampleAt(ride: Ride, time: number): {
    distance: number;
    speed: number;
};
/** The moment a recorded ride reaches a given distance. */
export declare function timeAtDistance(ride: {
    samples?: Samples;
}, distance: number): number;
