import { useState, useEffect, useRef } from 'react';
import { Effect, Fiber, Exit } from 'effect';
import type { TrafficLight } from '../types';
import { fetchTrafficLightsEffect } from '../services/trafficLightsEffect';

interface UseTrafficLightsResult {
  trafficLights: TrafficLight[];
  isLoading: boolean;
  error: string | null;
}

export function useTrafficLights(
  coordinates: [number, number][]
): UseTrafficLightsResult {
  const [trafficLights, setTrafficLights] = useState<TrafficLight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track coordinates by a hash to avoid re-fetching on reference changes
  const coordsHashRef = useRef<string>('');
  const coordsRef = useRef<[number, number][]>([]);
  const fiberRef = useRef<Fiber.RuntimeFiber<TrafficLight[], never> | null>(null);

  // Create a simple hash of coordinates
  const coordsHash = coordinates.length > 0
    ? `${coordinates.length}-${coordinates[0][0]},${coordinates[0][1]}-${coordinates[coordinates.length-1][0]},${coordinates[coordinates.length-1][1]}`
    : '';

  useEffect(() => {
    if (coordinates.length === 0) {
      setTrafficLights([]);
      coordsHashRef.current = '';
      return;
    }

    // Skip if coordinates haven't actually changed
    if (coordsHash === coordsHashRef.current) {
      return;
    }

    coordsHashRef.current = coordsHash;
    coordsRef.current = coordinates;

    // Cancel any in-flight request
    if (fiberRef.current) {
      Effect.runFork(Fiber.interrupt(fiberRef.current));
      fiberRef.current = null;
    }

    setIsLoading(true);
    setError(null);

    // Create the effect with interruption handling
    const effect = Effect.gen(function* () {
      const lights = yield* fetchTrafficLightsEffect(coordsRef.current);
      return lights;
    });

    // Fork the effect to get a fiber we can interrupt
    const fiber = Effect.runFork(effect);
    fiberRef.current = fiber;

    // Await the fiber result
    Effect.runPromise(Fiber.await(fiber)).then((exit) => {
      // Only update state if this is still the current request
      if (fiberRef.current !== fiber) return;

      if (Exit.isSuccess(exit)) {
        setTrafficLights(exit.value);
      } else if (Exit.isInterrupted(exit)) {
        // Request was cancelled, do nothing
        console.log('Traffic light request was interrupted');
      } else {
        // Failure case - our Effect already handles this by returning []
        console.warn('Traffic light fetch failed:', exit.cause);
        setTrafficLights([]);
      }
      setIsLoading(false);
    });

    return () => {
      // Interrupt the fiber on cleanup
      if (fiberRef.current) {
        Effect.runFork(Fiber.interrupt(fiberRef.current));
        fiberRef.current = null;
      }
    };
  }, [coordinates, coordsHash]);

  return {
    trafficLights,
    isLoading,
    error,
  };
}
