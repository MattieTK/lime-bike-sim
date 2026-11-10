import type { RouteSignal, Traffic } from '../types';
import { hashInts, mulberry32 } from './rng';

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

const AMBER = 3;
const RED_AMBER = 2;

// Junction cycle lengths, seconds. UK cycles run up to 120 s; SCOOT moves in 8 s steps.
const JUNCTION_CYCLES: Record<Traffic, number[]> = {
  quiet: [56, 64, 72, 80],
  typical: [64, 72, 80, 88, 96],
  rush: [80, 88, 96, 104, 112, 120],
};
// Share of a junction's cycle that is green for the rider's approach.
const GREEN_SHARE_MIN = 0.3;
const GREEN_SHARE_MAX = 0.55;

// Signalled crossings rest on green for traffic and only change when someone
// presses the button, so the "cycle" is how often that happens.
const CROSSING_CYCLES: Record<Traffic, [number, number]> = {
  quiet: [150, 240],
  typical: [70, 110],
  rush: [45, 75],
};
// Seconds traffic is held per crossing call (amber, red, red+amber).
const CROSSING_HOLD: [number, number] = [16, 24];

const TRAFFIC_INDEX: Record<Traffic, number> = { quiet: 0, typical: 1, rush: 2 };

export function planFor(signal: Pick<RouteSignal, 'id' | 'kind'>, traffic: Traffic): SignalPlan {
  const rand = mulberry32(hashInts(signal.id, TRAFFIC_INDEX[traffic]));
  if (signal.kind === 'junction') {
    const cycles = JUNCTION_CYCLES[traffic];
    const cycle = cycles[Math.floor(rand() * cycles.length)];
    const share = GREEN_SHARE_MIN + (GREEN_SHARE_MAX - GREEN_SHARE_MIN) * rand();
    return { cycle, green: Math.round(cycle * share), amber: AMBER, redAmber: RED_AMBER };
  }
  const [lo, hi] = CROSSING_CYCLES[traffic];
  const cycle = Math.round(lo + (hi - lo) * rand());
  const hold = CROSSING_HOLD[0] + (CROSSING_HOLD[1] - CROSSING_HOLD[0]) * rand();
  return { cycle, green: Math.round(cycle - hold), amber: AMBER, redAmber: RED_AMBER };
}

/** Phase shown at `time` seconds, for a light whose cycle started `offset` seconds before the ride. */
export function phaseAt(plan: SignalPlan, time: number, offset: number): Phase {
  const u = (((time + offset) % plan.cycle) + plan.cycle) % plan.cycle;
  if (u < plan.green) return 'green';
  if (u < plan.green + plan.amber) return 'amber';
  if (u < plan.cycle - plan.redAmber) return 'red';
  return 'redAmber';
}

/** Chance of arriving at anything other than green. */
export function stopChance(plan: SignalPlan): number {
  return 1 - plan.green / plan.cycle;
}
