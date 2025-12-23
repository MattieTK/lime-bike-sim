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

// Props for the main component
export interface LimeBikeSimulatorProps {
  // Location props
  startLocation?: Location;
  endLocation?: Location;

  // Pricing props (configurable) - in GBP
  unlockFee?: number; // Default: 1.00
  perMinuteRate?: number; // Default: 0.20

  // Simulation props
  simulationSpeed?: number; // Multiplier, default: 10 (10x real-time)

  // Traffic light wait simulation
  minWaitTime?: number; // seconds, default: 15
  maxWaitTime?: number; // seconds, default: 90

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

// Traffic light types from Overpass API
export interface TrafficLight {
  id: number;
  lat: number;
  lng: number;
  routeIndex: number; // Index in route coordinates where this light is
  distanceFromStart: number; // meters from route start
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
  wastedMoney: number; // totalCost - idealCost
}

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
