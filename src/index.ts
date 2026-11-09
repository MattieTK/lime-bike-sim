// Main component - named export only (recommended for libraries)
export { LimeBikeSimulator } from './LimeBikeSimulator';

// SSR-safe lazy-loaded version (use with client:only="react" in Astro)
export { LimeBikeSimulatorLazy } from './LimeBikeSimulatorLazy';

// Types
export type {
  LimeBikeSimulatorProps,
  Location,
  SimulationState,
  SimulationStatus,
  CostBreakdown,
  PrecomputedRoute,
  PrecomputedTrafficLight,
} from './types';

// Constants
export { BIKE_PHYSICS } from './types';
