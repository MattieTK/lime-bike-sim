import type { PricePlan, Traffic } from '../types';
import { type Rates } from './pricing';
import { type RideContext } from './ride';
/**
 * One animated ride is a single roll of the dice: catch a run of greens and
 * the lights cost nothing, hit every red and they cost a lot. The forecast
 * rides the route a few hundred times, setting off at a different moment each
 * time, to show what the lights cost on average and how much that varies.
 */
export interface Forecast {
    rides: number;
    /** Seconds with every light green. */
    freeFlow: number;
    /** Seconds added by lights, one entry per simulated ride, sorted ascending. */
    delays: number[];
    meanDelay: number;
    medianDelay: number;
    lowDelay: number;
    highDelay: number;
    meanStops: number;
    meanDuration: number;
    /** Average bill, and the average bill with every light green. */
    meanFare: number;
    freeFlowFare: number;
    /** Average amount the lights add to the bill. */
    meanExtra: number;
    /** Share of rides where the lights added at least one billed minute. */
    chanceOfExtra: number;
}
export declare const FORECAST_RIDES = 400;
export declare function runForecast(ctx: RideContext, traffic: Traffic, plan: PricePlan, rates: Rates, rides?: number): Forecast;
/** Share of forecast rides that lost less time to lights than this one did. */
export declare function luckPercentile(forecast: Forecast, delay: number): number;
/** Counts of forecast rides in equal-width bins of delay, for the histogram. */
export declare function histogram(forecast: Forecast, bins?: number): {
    binSeconds: number;
    counts: number[];
};
