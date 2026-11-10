import { Effect } from 'effect';
import { TrafficLight } from '../types';

export declare function fetchTrafficLightsEffect(coordinates: [number, number][]): Effect.Effect<TrafficLight[], never>;
export declare function runFetchTrafficLights(coordinates: [number, number][]): Promise<TrafficLight[]>;
//# sourceMappingURL=trafficLightsEffect.d.ts.map