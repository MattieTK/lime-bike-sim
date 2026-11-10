import type { Pace, RoutePlan, Traffic } from '../types';
import { PACE_PROFILES } from '../types';
import { angleBetween, bearing, pointAt } from './geo';
import { mulberry32 } from './rng';
import { phaseAt, planFor, type SignalPlan } from './signalModel';

/**
 * The ride model.
 *
 * A rider accelerates to a cruising speed, eases off for corners, pushes the
 * bike where the router says to dismount, and brakes for any light that is not
 * green. The whole ride is worked out up front as a list of time samples, so
 * playback is just reading it back and the same ride can be scrubbed or replayed.
 *
 * The cost of the lights is measured against a twin ride on the same route with
 * every light green. That captures the time lost braking and pulling away as
 * well as the time spent standing still.
 */

const GRID_M = 2; // spacing of the speed-limit profile
const DT = 0.2; // simulation time step, seconds
const WALK_SPEED = 1.4; // m/s, pushing the bike
const MIN_CORNER_SPEED = 2.2; // m/s, about 8 km/h
const CHORD_CELLS = 3; // corners are measured over 6 m either side
const STOP_GAP_M = 1; // riders stop about a metre short of the line
const CRAWL = 0.4; // m/s floor so the rider always reaches the end

export interface RideContext {
  plan: RoutePlan;
  pace: Pace;
  /** Highest speed the rider would choose at each grid point, already eased for braking. */
  limit: Float32Array;
  /** Where the delay caused by each light is measured: halfway to the next light. */
  checkpoints: number[];
  /** The ride with every light green. */
  freeFlow: { duration: number; checkpointTimes: number[]; samples?: Samples };
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

/** How much of cruising speed a rider keeps through a bend of `angle` degrees. */
function cornerFactor(angle: number): number {
  if (angle <= 15) return 1;
  if (angle <= 45) return 1 - ((angle - 15) / 30) * 0.28;
  if (angle <= 90) return 0.72 - ((angle - 45) / 45) * 0.27;
  return Math.max(0.3, 0.45 - ((angle - 90) / 60) * 0.15);
}

export function createContext(plan: RoutePlan, pace: Pace): RideContext {
  const rider = PACE_PROFILES[pace];
  const n = Math.max(2, Math.ceil(plan.distance / GRID_M) + 1);
  const limit = new Float32Array(n).fill(rider.cruise);

  // Corners: compare the heading just before and just after each grid point.
  const pts = new Array<{ lat: number; lng: number }>(n);
  for (let i = 0; i < n; i++) {
    pts[i] = pointAt(plan.coordinates, plan.cum, Math.min(i * GRID_M, plan.distance));
  }
  for (let i = CHORD_CELLS; i < n - CHORD_CELLS; i++) {
    const a = pts[i - CHORD_CELLS];
    const b = pts[i];
    const c = pts[i + CHORD_CELLS];
    const turn = angleBetween(bearing(a.lat, a.lng, b.lat, b.lng), bearing(b.lat, b.lng, c.lat, c.lng));
    const cap = Math.max(MIN_CORNER_SPEED, rider.cruise * cornerFactor(turn));
    if (cap < limit[i]) limit[i] = cap;
  }

  // Stretches where the router says to get off and push.
  for (const step of plan.steps) {
    if (!step.walk) continue;
    const from = Math.max(0, Math.floor(step.from / GRID_M));
    const to = Math.min(n - 1, Math.ceil(step.to / GRID_M));
    for (let i = from; i <= to; i++) limit[i] = Math.min(limit[i], WALK_SPEED);
  }

  // Come to rest at the destination, and never enter a slow section faster
  // than the rider can comfortably brake for it.
  limit[n - 1] = 0;
  for (let i = n - 2; i >= 0; i--) {
    const reachable = Math.sqrt(limit[i + 1] ** 2 + 2 * rider.brake * GRID_M);
    if (reachable < limit[i]) limit[i] = reachable;
  }

  const checkpoints = plan.signals.map((sig, i) => {
    const next = plan.signals[i + 1];
    return next ? (sig.distance + next.distance) / 2 : plan.distance;
  });

  const ctx: RideContext = {
    plan,
    pace,
    limit,
    checkpoints,
    freeFlow: { duration: 0, checkpointTimes: [] },
  };
  const free = run(ctx, null, null, true);
  ctx.freeFlow = {
    duration: free.duration,
    checkpointTimes: free.checkpointTimes,
    samples: free.samples,
  };
  return ctx;
}

interface RunResult {
  duration: number;
  stops: Stop[];
  checkpointTimes: number[];
  samples?: Samples;
}

function run(
  ctx: RideContext,
  plans: SignalPlan[] | null,
  offsets: number[] | null,
  record: boolean
): RunResult {
  const { plan, limit, checkpoints } = ctx;
  const rider = PACE_PROFILES[ctx.pace];
  const total = plan.distance;
  const signals = plans ? plan.signals : [];
  const hardBrake = rider.brake * 1.6;

  const ts: number[] = [];
  const ss: number[] = [];
  const vs: number[] = [];
  const stops: Stop[] = [];
  const checkpointTimes: number[] = [];

  let t = 0;
  let s = 0;
  let v = 0;
  let next = 0; // index of the light ahead
  let cp = 0;
  let committed = false; // too close to stop when it went amber, so riding through
  let amberSeen = false;
  let stoppedAt = -1; // time the rider halted at the light ahead, or -1
  let greenAt = -1; // time that light turned green while the rider was stopped

  const maxTime = 6 * 3600;
  while (s < total - 0.05 && t < maxTime) {
    if (record) {
      ts.push(t);
      ss.push(s);
      vs.push(v);
    }

    const cell = Math.min(limit.length - 2, Math.floor(s / GRID_M));
    let target = Math.min(limit[cell], limit[cell + 1], v + rider.accel * DT);
    if (target < CRAWL) target = CRAWL;
    let halted = false;

    if (next < signals.length) {
      const gap = signals[next].distance - STOP_GAP_M - s;
      const phase = phaseAt(plans![next], t, offsets![next]);
      if (phase === 'green') {
        amberSeen = false;
        committed = false;
        if (stoppedAt >= 0) {
          // Standing at the line: take a moment to notice the green and push off.
          // Someone who only just touched down as it changed rolls straight off.
          if (greenAt < 0) greenAt = t;
          const brief = greenAt - stoppedAt < 1.5;
          if (brief || t - greenAt >= rider.reaction) {
            if (!brief) stops.push({ signal: next, at: stoppedAt, wait: t - stoppedAt });
            stoppedAt = -1;
            greenAt = -1;
          } else {
            halted = true;
          }
        }
      } else {
        greenAt = -1;
        if (phase === 'amber' && !amberSeen) {
          amberSeen = true;
          // Ride through only if stopping would mean braking hard.
          committed = gap < (v * v) / (2 * hardBrake) + v * 0.5;
        }
        if (!committed || phase !== 'amber') {
          if (stoppedAt >= 0 || gap <= 0.05 || (v < 0.3 && gap < 0.6)) {
            if (stoppedAt < 0) stoppedAt = t;
            halted = true;
          } else {
            target = Math.min(target, Math.max(0.3, Math.sqrt(2 * rider.brake * gap)));
          }
        }
      }
    }

    const nextV = halted ? 0 : target;
    const step = ((v + nextV) / 2) * DT;
    const prevS = s;
    s = Math.min(total, s + step);
    v = nextV;
    t += DT;

    while (cp < checkpoints.length && s >= checkpoints[cp] - 1e-6) {
      const span = s - prevS;
      const frac = span > 0 ? (checkpoints[cp] - prevS) / span : 1;
      checkpointTimes[cp++] = t - DT + DT * Math.min(1, Math.max(0, frac));
    }
    if (next < signals.length && s >= signals[next].distance) {
      next++;
      committed = false;
      amberSeen = false;
    }
  }
  while (cp < checkpoints.length) checkpointTimes[cp++] = t;

  const result: RunResult = { duration: t, stops, checkpointTimes };
  if (record) {
    ts.push(t);
    ss.push(total);
    vs.push(0);
    result.samples = {
      t: Float32Array.from(ts),
      s: Float32Array.from(ss),
      v: Float32Array.from(vs),
    };
  }
  return result;
}

/** One ride. The seed decides where every light is in its cycle when you unlock. */
export function simulateRide(
  ctx: RideContext,
  traffic: Traffic,
  seed: number,
  record = true
): Ride {
  const plans = signalPlans(ctx, traffic);
  const rand = mulberry32(seed);
  const offsets = plans.map((p) => rand() * p.cycle);
  const out = run(ctx, plans, offsets, record);

  const signalDelay: number[] = [];
  let before = 0;
  for (let i = 0; i < plans.length; i++) {
    const lag = out.checkpointTimes[i] - ctx.freeFlow.checkpointTimes[i];
    signalDelay.push(lag - before);
    before = lag;
  }
  return {
    seed,
    duration: out.duration,
    delay: Math.max(0, out.duration - ctx.freeFlow.duration),
    waiting: out.stops.reduce((sum, st) => sum + st.wait, 0),
    stops: out.stops,
    signalDelay,
    offsets,
    samples: out.samples,
  };
}

const planCache = new WeakMap<RideContext, Partial<Record<Traffic, SignalPlan[]>>>();
export function signalPlans(ctx: RideContext, traffic: Traffic): SignalPlan[] {
  let byTraffic = planCache.get(ctx);
  if (!byTraffic) planCache.set(ctx, (byTraffic = {}));
  return (byTraffic[traffic] ??= ctx.plan.signals.map((sig) => planFor(sig, traffic)));
}

/** Distance and speed at a moment of a recorded ride. */
export function sampleAt(ride: Ride, time: number): { distance: number; speed: number } {
  const sm = ride.samples;
  if (!sm || sm.t.length === 0) return { distance: 0, speed: 0 };
  const last = sm.t.length - 1;
  if (time <= 0) return { distance: sm.s[0], speed: sm.v[0] };
  if (time >= sm.t[last]) return { distance: sm.s[last], speed: 0 };
  const i = Math.min(last - 1, Math.floor(time / DT));
  const f = (time - sm.t[i]) / (sm.t[i + 1] - sm.t[i] || DT);
  return {
    distance: sm.s[i] + (sm.s[i + 1] - sm.s[i]) * f,
    speed: sm.v[i] + (sm.v[i + 1] - sm.v[i]) * f,
  };
}

/** The moment a recorded ride reaches a given distance. */
export function timeAtDistance(ride: { samples?: Samples }, distance: number): number {
  const sm = ride.samples;
  if (!sm) return 0;
  let lo = 0;
  let hi = sm.s.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (sm.s[mid] < distance) lo = mid;
    else hi = mid;
  }
  const span = sm.s[hi] - sm.s[lo];
  return sm.t[lo] + (span > 0 ? ((distance - sm.s[lo]) / span) * (sm.t[hi] - sm.t[lo]) : 0);
}
