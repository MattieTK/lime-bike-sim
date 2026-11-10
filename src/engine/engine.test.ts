import { describe, expect, it } from 'vitest';
import type { RoutePlan, RouteSignal } from '../types';
import { cumulativeDistances, inPolygon, projectOntoLine, type LngLat } from './geo';
import { histogram, luckPercentile, runForecast } from './forecast';
import { planFromPrecomputed, toPrecomputed } from './plan';
import { billedMinutes, limeFare } from './pricing';
import { createContext, sampleAt, simulateRide, timeAtDistance } from './ride';
import { toSteps, streetAt } from './routing';
import { phaseAt, planFor } from './signalModel';
import { matchSignals, type SignalNode } from './signals';

const rates = { unlockFee: 1, perMinuteRate: 0.33 };

/** A dead-straight road heading north, with lights wherever asked. */
function straightRoad(metres: number, lightsAt: number[] = [], kind: RouteSignal['kind'] = 'junction'): RoutePlan {
  const perMetre = 1 / 111195; // degrees of latitude
  const coordinates: LngLat[] = [];
  for (let d = 0; d <= metres; d += 50) coordinates.push([-0.1, 51.5 + d * perMetre]);
  const cum = cumulativeDistances(coordinates);
  const distance = cum[cum.length - 1];
  return {
    coordinates,
    cum,
    distance,
    steps: [{ from: 0, to: distance, name: 'Test Road', walk: false }],
    signals: lightsAt.map((at, i) => ({
      id: 1000 + i,
      lat: 51.5 + at * perMetre,
      lng: -0.1,
      distance: at,
      kind,
      name: 'Test Road',
    })),
    signalSource: 'precomputed',
    drivingFallback: false,
  };
}

describe('pricing', () => {
  it('rounds ride time up to the next full minute', () => {
    expect(billedMinutes(1)).toBe(1);
    expect(billedMinutes(60)).toBe(1);
    expect(billedMinutes(60.5)).toBe(2);
    expect(billedMinutes(599)).toBe(10);
  });

  it('charges unlock plus started minutes on pay as you go', () => {
    expect(limeFare('payg', 601, rates)).toBeCloseTo(1 + 11 * 0.33);
  });

  it('charges LimePrime a flat fare up to the cap', () => {
    expect(limeFare('prime', 4 * 60, rates)).toBe(1);
    expect(limeFare('prime', 6 * 60, rates)).toBe(1.7);
    expect(limeFare('prime', 20 * 60, rates)).toBe(1.7);
    expect(limeFare('prime', 22 * 60, rates)).toBeCloseTo(1.7 + 2 * 0.33);
  });
});

describe('signal timing', () => {
  it('gives the same light the same plan every time', () => {
    const light = { id: 42, kind: 'junction' as const };
    expect(planFor(light, 'typical')).toEqual(planFor(light, 'typical'));
  });

  it('keeps junction plans inside the modelled ranges', () => {
    for (let id = 0; id < 200; id++) {
      const plan = planFor({ id, kind: 'junction' }, 'rush');
      expect(plan.cycle).toBeGreaterThanOrEqual(80);
      expect(plan.cycle).toBeLessThanOrEqual(120);
      expect(plan.green / plan.cycle).toBeGreaterThan(0.29);
      expect(plan.green / plan.cycle).toBeLessThan(0.56);
    }
  });

  it('leaves crossings green most of the time', () => {
    for (let id = 0; id < 200; id++) {
      const plan = planFor({ id, kind: 'crossing' }, 'typical');
      expect(plan.green / plan.cycle).toBeGreaterThan(0.6);
    }
  });

  it('runs green, amber, red, red+amber in order', () => {
    const plan = { cycle: 60, green: 25, amber: 3, redAmber: 2 };
    expect(phaseAt(plan, 0, 0)).toBe('green');
    expect(phaseAt(plan, 26, 0)).toBe('amber');
    expect(phaseAt(plan, 30, 0)).toBe('red');
    expect(phaseAt(plan, 59, 0)).toBe('redAmber');
    expect(phaseAt(plan, 60, 0)).toBe('green');
    expect(phaseAt(plan, 0, 30)).toBe('red');
  });
});

describe('ride model', () => {
  it('cruises at the chosen pace on an open road', () => {
    const ctx = createContext(straightRoad(2000), 'typical');
    const average = (2000 / ctx.freeFlow.duration) * 3.6;
    // 21 km/h cruise, minus pulling away and stopping.
    expect(average).toBeGreaterThan(20);
    expect(average).toBeLessThan(21);
  });

  it('is faster for a faster rider', () => {
    const road = straightRoad(2000);
    expect(createContext(road, 'fast').freeFlow.duration).toBeLessThan(
      createContext(road, 'relaxed').freeFlow.duration
    );
  });

  it('slows for a sharp corner', () => {
    const straight = straightRoad(400);
    const bent: RoutePlan = { ...straight, coordinates: [...straight.coordinates] };
    // Turn 90° east halfway along.
    const turnAt = bent.coordinates[4];
    bent.coordinates = [
      ...bent.coordinates.slice(0, 5),
      [turnAt[0] + 0.0015, turnAt[1]],
      [turnAt[0] + 0.003, turnAt[1]],
    ];
    bent.cum = cumulativeDistances(bent.coordinates);
    bent.distance = bent.cum[bent.cum.length - 1];
    bent.steps = [{ from: 0, to: bent.distance, name: '', walk: false }];
    const ctx = createContext(bent, 'typical');
    const atCorner = sampleAt({ samples: ctx.freeFlow.samples } as never, timeAtDistance(ctx.freeFlow, 200));
    expect(atCorner.speed * 3.6).toBeLessThan(12);
  });

  it('never loses time when there are no lights', () => {
    const ctx = createContext(straightRoad(1500), 'typical');
    const ride = simulateRide(ctx, 'typical', 7);
    expect(ride.delay).toBe(0);
    expect(ride.stops).toHaveLength(0);
  });

  it('never passes a light on red', () => {
    const plan = straightRoad(3000, [400, 900, 1500, 2100, 2600]);
    const ctx = createContext(plan, 'typical');
    for (let seed = 1; seed <= 40; seed++) {
      const ride = simulateRide(ctx, 'typical', seed);
      plan.signals.forEach((sig, i) => {
        const when = timeAtDistance(ride, sig.distance);
        const phase = phaseAt(planFor(sig, 'typical'), when, ride.offsets[i]);
        expect(phase === 'green' || phase === 'amber').toBe(true);
      });
    }
  });

  it('attributes all of the delay to individual lights', () => {
    const ctx = createContext(straightRoad(3000, [400, 900, 1500, 2100, 2600]), 'typical');
    for (let seed = 1; seed <= 20; seed++) {
      const ride = simulateRide(ctx, 'typical', seed);
      const summed = ride.signalDelay.reduce((a, b) => a + b, 0);
      expect(summed).toBeCloseTo(ride.duration - ctx.freeFlow.duration, 3);
      // Standing still is only part of what a red costs.
      expect(ride.delay).toBeGreaterThanOrEqual(ride.waiting - 0.5);
    }
  });

  it('replays identically from the same seed', () => {
    const ctx = createContext(straightRoad(2000, [500, 1200]), 'typical');
    expect(simulateRide(ctx, 'typical', 99).duration).toBe(simulateRide(ctx, 'typical', 99).duration);
  });

  it('matches queueing theory for one light', () => {
    // Expected delay at a fixed-time signal for a lone arrival is roughly
    // red² / (2 × cycle), plus the time lost braking and pulling away.
    const plan = straightRoad(1200, [600]);
    const ctx = createContext(plan, 'typical');
    const timing = planFor(plan.signals[0], 'typical');
    const red = timing.cycle - timing.green - timing.amber;
    const theory = (red * red) / (2 * timing.cycle);
    const forecast = runForecast(ctx, 'typical', 'payg', rates, 2000);
    expect(forecast.meanDelay).toBeGreaterThan(theory);
    expect(forecast.meanDelay).toBeLessThan(theory + 8);
  });
});

describe('forecast', () => {
  const ctx = createContext(straightRoad(3000, [400, 900, 1500, 2100, 2600]), 'typical');
  const forecast = runForecast(ctx, 'typical', 'payg', rates);

  it('summarises a spread of rides', () => {
    expect(forecast.lowDelay).toBeLessThanOrEqual(forecast.medianDelay);
    expect(forecast.medianDelay).toBeLessThanOrEqual(forecast.highDelay);
    expect(forecast.meanFare).toBeGreaterThanOrEqual(forecast.freeFlowFare);
    expect(forecast.meanExtra).toBeCloseTo(forecast.meanFare - forecast.freeFlowFare);
  });

  it('bins every ride into the histogram', () => {
    const { counts } = histogram(forecast);
    expect(counts.reduce((a, b) => a + b, 0)).toBe(forecast.rides);
  });

  it('ranks a ride against the rest', () => {
    expect(luckPercentile(forecast, -1)).toBe(0);
    expect(luckPercentile(forecast, 1e6)).toBe(1);
  });

  it('costs nothing extra on a flat fare under the cap', () => {
    expect(runForecast(ctx, 'typical', 'prime', rates).meanExtra).toBeCloseTo(0, 6);
  });
});

describe('matching lights to a route', () => {
  const road = straightRoad(1000);
  const node = (metres: number, east = 0, extra: Partial<SignalNode> = {}): SignalNode => ({
    lat: 51.5 + metres / 111195,
    lng: -0.1 + east / 69200,
    kind: 'junction',
    bearing: -1,
    ...extra,
  });
  const match = (nodes: SignalNode[]) => matchSignals(nodes, road.coordinates, road.cum, road.steps);

  it('merges the stop lines of one junction into one set of lights', () => {
    const found = match([node(300), node(318, 9), node(330)]);
    expect(found).toHaveLength(1);
    expect(found[0].distance).toBeCloseTo(300, 0);
    expect(found[0].name).toBe('Test Road');
  });

  it('keeps separate junctions separate', () => {
    expect(match([node(300), node(450)])).toHaveLength(2);
  });

  it('ignores lights on a parallel street', () => {
    expect(match([node(300, 40)])).toHaveLength(0);
  });

  it('ignores a crossing that is not on the route itself', () => {
    expect(match([node(300, 14, { kind: 'crossing' })])).toHaveLength(0);
    expect(match([node(300, 3, { kind: 'crossing' })])).toHaveLength(1);
  });

  it('ignores a stop line that faces oncoming traffic', () => {
    // The route heads north (0°); this signal applies to southbound traffic.
    expect(match([node(300, 0, { bearing: 180 })])).toHaveLength(0);
    expect(match([node(300, 0, { bearing: 4 })])).toHaveLength(1);
  });

  it('calls a cluster a junction if any of its signals is one', () => {
    const found = match([node(300, 2, { kind: 'crossing' }), node(315)]);
    expect(found).toHaveLength(1);
    expect(found[0].kind).toBe('junction');
  });
});

describe('geometry and route data', () => {
  it('projects a point onto a line', () => {
    const road = straightRoad(500);
    const [hit] = projectOntoLine(51.5 + 120 / 111195, -0.1 + 5 / 69200, road.coordinates, road.cum, 20);
    expect(hit.along).toBeCloseTo(120, 0);
    expect(hit.offset).toBeCloseTo(5, 0);
  });

  it('tests points against a polygon', () => {
    const square: LngLat[] = [[0, 0], [2, 0], [2, 2], [0, 2], [0, 0]];
    expect(inPolygon(1, 1, square)).toBe(true);
    expect(inPolygon(3, 1, square)).toBe(false);
  });

  it('merges router steps into named stretches and flags pushing sections', () => {
    const steps = toSteps(
      [
        { distance: 100, name: 'A Street', mode: 'cycling' },
        { distance: 50, name: 'A Street', mode: 'cycling' },
        { distance: 30, name: '', mode: 'pushing bike' },
        { distance: 120, name: 'B Road', mode: 'cycling' },
      ],
      300,
      300
    );
    expect(steps).toHaveLength(3);
    expect(steps[0]).toMatchObject({ from: 0, to: 150, name: 'A Street', walk: false });
    expect(steps[1].walk).toBe(true);
    expect(streetAt(steps, 160)).toBe('B Road');
  });

  it('round-trips a plan through the precomputed format', () => {
    const plan = straightRoad(1000, [300, 700]);
    const again = planFromPrecomputed(toPrecomputed(plan));
    expect(again.signals.map((s) => Math.round(s.distance))).toEqual([300, 700]);
    expect(again.distance).toBeCloseTo(plan.distance, 3);
  });

  it('still accepts version 1 precomputed routes', () => {
    const plan = planFromPrecomputed({
      coordinates: straightRoad(1000).coordinates,
      distance: 1000,
      trafficLights: [{ id: 1, lat: 51.503, lng: -0.1, distanceFromStart: 333 }],
    });
    expect(plan.signals[0]).toMatchObject({ kind: 'junction', name: '' });
  });
});
