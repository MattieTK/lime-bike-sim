// Main component
export { LimeBikeSimulator } from './LimeBikeSimulator';

// SSR-safe lazy-loaded version (use with client:only="react" in Astro)
export { LimeBikeSimulatorLazy } from './LimeBikeSimulatorLazy';

// Types
export type {
  LimeBikeSimulatorProps,
  Location,
  Pace,
  Traffic,
  PricePlan,
  RoutePlan,
  RouteSignal,
  RouteStep,
  SimulationState,
  SimulationStatus,
  CostBreakdown,
  PrecomputedRoute,
  PrecomputedTrafficLight,
} from './types';

// Constants
export { BIKE_PHYSICS, PACE_PROFILES } from './types';

// The model itself, for anyone who wants the numbers without the map
export { buildPlan, planFromPrecomputed, toPrecomputed } from './engine/plan';
export { createContext, simulateRide } from './engine/ride';
export { runForecast } from './engine/forecast';
export { limeFare, billedMinutes, LIME } from './engine/pricing';
