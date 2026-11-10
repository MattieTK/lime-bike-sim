import type { PricePlan, Traffic } from '../types';
import { limeFare, type Rates } from './pricing';
import { hashInts } from './rng';
import { simulateRide, type RideContext } from './ride';

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
  lowDelay: number; // 10th percentile
  highDelay: number; // 90th percentile
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

export const FORECAST_RIDES = 400;

export function runForecast(
  ctx: RideContext,
  traffic: Traffic,
  plan: PricePlan,
  rates: Rates,
  rides = FORECAST_RIDES
): Forecast {
  const freeFlowFare = limeFare(plan, ctx.freeFlow.duration, rates);
  const base = hashInts(Math.round(ctx.plan.distance), ctx.plan.signals.length, 7919);
  const delays: number[] = [];
  let stops = 0;
  let duration = 0;
  let fare = 0;
  let withExtra = 0;

  for (let i = 0; i < rides; i++) {
    const ride = simulateRide(ctx, traffic, hashInts(base, i), false);
    const cost = limeFare(plan, ride.duration, rates);
    delays.push(ride.delay);
    stops += ride.stops.length;
    duration += ride.duration;
    fare += cost;
    if (cost > freeFlowFare + 1e-9) withExtra++;
  }
  delays.sort((a, b) => a - b);
  const at = (q: number) => delays[Math.min(rides - 1, Math.floor(q * rides))];
  const meanFare = fare / rides;

  return {
    rides,
    freeFlow: ctx.freeFlow.duration,
    delays,
    meanDelay: delays.reduce((a, b) => a + b, 0) / rides,
    medianDelay: at(0.5),
    lowDelay: at(0.1),
    highDelay: at(0.9),
    meanStops: stops / rides,
    meanDuration: duration / rides,
    meanFare,
    freeFlowFare,
    meanExtra: meanFare - freeFlowFare,
    chanceOfExtra: withExtra / rides,
  };
}

/** Share of forecast rides that lost less time to lights than this one did. */
export function luckPercentile(forecast: Forecast, delay: number): number {
  let lo = 0;
  let hi = forecast.delays.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (forecast.delays[mid] < delay) lo = mid + 1;
    else hi = mid;
  }
  return lo / forecast.delays.length;
}

/** Counts of forecast rides in equal-width bins of delay, for the histogram. */
export function histogram(forecast: Forecast, bins = 16): { binSeconds: number; counts: number[] } {
  const max = Math.max(30, forecast.delays[forecast.delays.length - 1] ?? 0);
  const binSeconds = Math.max(5, Math.ceil(max / bins / 5) * 5);
  const counts = new Array<number>(Math.ceil(max / binSeconds) || 1).fill(0);
  for (const d of forecast.delays) counts[Math.min(counts.length - 1, Math.floor(d / binSeconds))]++;
  return { binSeconds, counts };
}
