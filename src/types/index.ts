import type { LatLngExpression } from 'leaflet';

// Location types
export interface Location {
  lat: number;
  lng: number;
  label?: string;
}

// Bike physics constants
export const BIKE_PHYSICS = {
  MAX_SPEED_MPH: 15,
  MAX_SPEED_KMH: 24.14, // 15 mph in km/h
  MAX_SPEED_MS: 6.7056, // 15 mph in m/s
  ACCELERATION_TIME: 5, // seconds to reach max speed
  BRAKING_TIME: 3, // seconds to come to a stop
  ACCELERATION_RATE: 1.341, // m/s² (6.7056 / 5)
  DECELERATION_RATE: 2.235, // m/s² (6.7056 / 3)
} as const;

// Pre-computed route data for caching/static routes
export interface PrecomputedRoute {
  coordinates: [number, number][]; // [lng, lat] array from OSRM
  distance: number; // total meters
  trafficLights: PrecomputedTrafficLight[]; // simplified traffic light data
}

// Simplified traffic light for pre-computed routes (timing generated at runtime)
export interface PrecomputedTrafficLight {
  id: number;
  lat: number;
  lng: number;
  distanceFromStart: number; // meters from route start
}

// Props for the main component
export interface LimeBikeSimulatorProps {
  // Location props
  startLocation?: Location;
  endLocation?: Location;

  // Pre-computed route data (skips API calls if provided)
  precomputedRoute?: PrecomputedRoute;

  // Pricing props (configurable) - in GBP
  unlockFee?: number; // Default: 1.00
  perMinuteRate?: number; // Default: 0.20

  // Simulation props
  simulationSpeed?: number; // Multiplier, default: 10 (10x real-time)

  // UI props
  width?: string | number;
  height?: string | number;
  showControls?: boolean; // Default: true
  allowLocationPicker?: boolean; // Default: true when no locations provided
}

// Route types from OSRM
export interface RouteStep {
  distance: number; // meters
  duration: number; // seconds
  geometry: {
    coordinates: [number, number][]; // [lng, lat]
  };
  name: string;
}

export interface Route {
  distance: number; // total meters
  duration: number; // total seconds (OSRM estimate, we calculate our own)
  geometry: {
    type: 'LineString';
    coordinates: [number, number][]; // [lng, lat]
  };
  legs: {
    steps: RouteStep[];
  }[];
}

export interface OSRMResponse {
  code: string;
  routes: Route[];
}

// Traffic light timing constants
export const TRAFFIC_LIGHT_TIMING = {
  MIN_CYCLE_TIME: 60, // seconds
  MAX_CYCLE_TIME: 120,
  RED_RATIO: 0.45, // 45% of cycle is red
  GREEN_RATIO: 0.50, // 50% of cycle is green
  YELLOW_DURATION: 4, // 4 seconds yellow (remaining 5%)
} as const;

// Traffic light timing for realistic cycling
export interface TrafficLightTiming {
  cycleTime: number; // Total cycle duration in seconds
  redDuration: number; // How long red phase lasts
  greenDuration: number; // How long green phase lasts
  yellowDuration: number; // How long yellow phase lasts
  phaseOffset: number; // Random offset into the cycle (0 to cycleTime)
}

// Traffic light phase
export type TrafficLightPhase = 'red' | 'yellow' | 'green';

// Calculate current phase of a traffic light based on elapsed time
export function getTrafficLightPhase(
  timing: TrafficLightTiming,
  elapsedTime: number
): { phase: TrafficLightPhase; timeInPhase: number; timeUntilGreen: number } {
  const { cycleTime, redDuration, greenDuration, yellowDuration, phaseOffset } = timing;

  // Calculate position in cycle (0 to cycleTime)
  const positionInCycle = (elapsedTime + phaseOffset) % cycleTime;

  // Phase order: green -> yellow -> red -> (repeat)
  if (positionInCycle < greenDuration) {
    return {
      phase: 'green',
      timeInPhase: positionInCycle,
      timeUntilGreen: 0,
    };
  } else if (positionInCycle < greenDuration + yellowDuration) {
    const timeInYellow = positionInCycle - greenDuration;
    return {
      phase: 'yellow',
      timeInPhase: timeInYellow,
      timeUntilGreen: yellowDuration - timeInYellow + redDuration,
    };
  } else {
    const timeInRed = positionInCycle - greenDuration - yellowDuration;
    return {
      phase: 'red',
      timeInPhase: timeInRed,
      timeUntilGreen: redDuration - timeInRed,
    };
  }
}

// Generate random timing for a traffic light
export function generateTrafficLightTiming(): TrafficLightTiming {
  const { MIN_CYCLE_TIME, MAX_CYCLE_TIME, RED_RATIO, GREEN_RATIO, YELLOW_DURATION } = TRAFFIC_LIGHT_TIMING;

  const cycleTime = MIN_CYCLE_TIME + Math.random() * (MAX_CYCLE_TIME - MIN_CYCLE_TIME);
  const redDuration = cycleTime * RED_RATIO;
  const greenDuration = cycleTime * GREEN_RATIO;
  const yellowDuration = YELLOW_DURATION;
  const phaseOffset = Math.random() * cycleTime;

  return {
    cycleTime,
    redDuration,
    greenDuration,
    yellowDuration,
    phaseOffset,
  };
}

// Traffic light types from Overpass API
export interface TrafficLight {
  id: number;
  lat: number;
  lng: number;
  routeIndex: number; // Index in route coordinates where this light is
  distanceFromStart: number; // meters from route start
  timing: TrafficLightTiming; // Timing for this light's cycle
}

export interface OverpassNode {
  type: 'node';
  id: number;
  lat: number;
  lon: number;
  tags?: Record<string, string>;
}

export interface OverpassResponse {
  elements: OverpassNode[];
}

// Simulation state
export type SimulationStatus = 'idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'finished';

export interface SimulationState {
  status: SimulationStatus;
  currentPosition: LatLngExpression;
  currentSpeed: number; // m/s
  elapsedTime: number; // seconds (simulation time)
  distanceTraveled: number; // meters
  routeProgress: number; // 0-1

  // Traffic light state
  currentTrafficLightIndex: number;
  isWaitingAtLight: boolean;
  currentWaitTime: number; // seconds waited at current light
  totalWaitTime: number; // total seconds waited at all lights
  lightsEncountered: number;
}

// Cost calculation
export interface CostBreakdown {
  unlockFee: number;
  ridingCost: number; // Cost from actual riding time
  waitingCost: number; // Cost from waiting at lights
  totalCost: number;
  idealCost: number; // Cost if there were no traffic lights
  stopRevenue: number; // Revenue generated from stop time (totalCost - idealCost)
  // Alternative pricing models for comparison
  distanceBasedCost: number; // What ride would cost at per-km rate
  motionOnlyCost: number; // What ride would cost if stopped time was free
}

// Alternative pricing rates for comparison
export const PRICING_MODELS = {
  PER_MINUTE: 0.20, // Current Lime rate (£/min)
  PER_KM: 0.30, // 30p per km
  UNLOCK_FEE: 1.00, // Standard unlock
} as const;

// Route segment for simulation
export interface RouteSegment {
  startIndex: number;
  endIndex: number;
  coordinates: [number, number][]; // [lng, lat]
  distance: number; // meters
  hasTrafficLightAtEnd: boolean;
  trafficLightId?: number;
}

// Geometry helpers
export interface InterpolatedPosition {
  lat: number;
  lng: number;
  bearing: number; // degrees, for bike icon rotation
  segmentIndex: number;
}
