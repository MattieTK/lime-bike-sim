import type { LngLat } from '../engine/geo';

export interface Location {
  lat: number;
  lng: number;
  label?: string;
}

/** How hard the rider pushes. Lime's motor stops assisting at 15.5 mph (25 km/h). */
export type Pace = 'relaxed' | 'typical' | 'fast';

/** How busy the streets are, which drives signal cycle lengths and crossing demand. */
export type Traffic = 'quiet' | 'typical' | 'rush';

/** Which Lime product pays for the ride. */
export type PricePlan = 'payg' | 'pass' | 'prime';

export type SignalKind = 'junction' | 'crossing';

/** A stretch of the route along one named street. */
export interface RouteStep {
  /** Metres from the start where this stretch begins and ends. */
  from: number;
  to: number;
  name: string;
  /** The router says to dismount and push here. */
  walk: boolean;
}

/** One set of traffic lights the route passes through. */
export interface RouteSignal {
  /** Stable identifier, used to give each light a repeatable timing plan. */
  id: number;
  lat: number;
  lng: number;
  /** Metres from the start to the stop line. */
  distance: number;
  kind: SignalKind;
  /** Street the rider is on when they reach it. */
  name: string;
}

export type SignalSource = 'bundled' | 'overpass' | 'precomputed' | 'unavailable';

/** Everything the simulator needs to know about a route. */
export interface RoutePlan {
  coordinates: LngLat[];
  /** Running distance at every coordinate, metres. */
  cum: Float64Array;
  distance: number;
  steps: RouteStep[];
  signals: RouteSignal[];
  signalSource: SignalSource;
  /** True when the bike router was down and a driving route was used instead. */
  drivingFallback: boolean;
}

/** Pre-computed route data: lets a host page skip the routing request. */
export interface PrecomputedRoute {
  coordinates: [number, number][]; // [lng, lat]
  distance: number; // metres
  trafficLights: PrecomputedTrafficLight[];
  steps?: RouteStep[];
}

export interface PrecomputedTrafficLight {
  id: number;
  lat: number;
  lng: number;
  distanceFromStart: number; // metres
  kind?: SignalKind; // defaults to 'junction'
  name?: string;
}

export interface LimeBikeSimulatorProps {
  startLocation?: Location;
  endLocation?: Location;
  /** Skips the routing and traffic-light lookups when provided. */
  precomputedRoute?: PrecomputedRoute;

  /** Pay-as-you-go unlock fee in GBP. Default 1.00. */
  unlockFee?: number;
  /** Pay-as-you-go price per started minute in GBP. Default 0.33. */
  perMinuteRate?: number;

  /** Playback speed multiplier. Default 20. */
  simulationSpeed?: number;

  width?: string | number;
  height?: string | number;
  showControls?: boolean;
  /** Let people choose their own route when none is passed in. Default true. */
  allowLocationPicker?: boolean;

  /** Colour scheme. 'auto' follows the visitor's system setting. Default 'auto'. */
  theme?: 'auto' | 'light' | 'dark';
  /** Initial rider pace. Default 'typical'. */
  pace?: Pace;
  /** Initial traffic level. Default 'typical'. */
  traffic?: Traffic;
  /** Fixes the first ride's luck, so the same ride can be replayed. */
  seed?: number;
  /** Keep a picked route in the page URL so it can be shared. Default true. */
  syncUrl?: boolean;
  /** Raster tile URL template, to use a different basemap. */
  tileUrl?: string;
  tileAttribution?: string;
}

export type SimulationStatus = 'idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'finished';

/** A snapshot of the ride at one moment of playback. */
export interface SimulationState {
  status: SimulationStatus;
  /** Seconds since unlock. */
  elapsedTime: number;
  distanceTraveled: number; // metres
  currentSpeed: number; // m/s
  routeProgress: number; // 0-1
  isWaitingAtLight: boolean;
  /** Seconds spent stationary at the current light. */
  currentWaitTime: number;
  /** Seconds spent stationary at lights so far. */
  totalWaitTime: number;
  /** Lights that have stopped the rider so far. */
  lightsEncountered: number;
  /** Index of the next light ahead. */
  currentTrafficLightIndex: number;
}

/** What the ride costs, and how much of that is down to red lights. */
export interface CostBreakdown {
  unlockFee: number;
  billedMinutes: number;
  totalCost: number;
  /** The same ride with every light green. */
  idealCost: number;
  /** totalCost - idealCost: what red lights added to the bill. */
  stopRevenue: number;
  /** Seconds the lights added to the ride (waiting plus braking and pulling away). */
  delaySeconds: number;
}

export const PACE_PROFILES: Record<
  Pace,
  { label: string; cruise: number; accel: number; brake: number; reaction: number }
> = {
  // cruise in m/s; accel and brake in m/s²; reaction = seconds to move off on green
  relaxed: { label: 'Relaxed', cruise: 17 / 3.6, accel: 0.8, brake: 1.3, reaction: 1.6 },
  typical: { label: 'Typical', cruise: 21 / 3.6, accel: 1.0, brake: 1.5, reaction: 1.2 },
  fast: { label: 'Flat out', cruise: 25 / 3.6, accel: 1.3, brake: 1.8, reaction: 0.9 },
};

/** Kept for backwards compatibility: the 'typical' rider in the old constant's shape. */
export const BIKE_PHYSICS = {
  MAX_SPEED_MPH: 15.5,
  MAX_SPEED_KMH: 25,
  MAX_SPEED_MS: 25 / 3.6,
  CRUISE_SPEED_MS: PACE_PROFILES.typical.cruise,
  ACCELERATION_RATE: PACE_PROFILES.typical.accel,
  DECELERATION_RATE: PACE_PROFILES.typical.brake,
} as const;
