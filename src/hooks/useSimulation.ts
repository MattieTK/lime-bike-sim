import { useState, useRef, useCallback, useEffect } from 'react';
import type { SimulationState, TrafficLight, InterpolatedPosition } from '../types';
import { BIKE_PHYSICS } from '../types';
import {
  interpolatePosition,
  calculateCurrentSpeed,
} from '../services/geometry';

interface UseSimulationProps {
  coordinates: [number, number][];
  cumulativeDistances: number[];
  trafficLights: TrafficLight[];
  totalDistance: number;
  simulationSpeed: number;
  minWaitTime: number;
  maxWaitTime: number;
}

interface UseSimulationResult {
  state: SimulationState;
  position: InterpolatedPosition | null;
  play: () => void;
  pause: () => void;
  reset: () => void;
  isReady: boolean;
}

function getRandomWaitTime(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

export function useSimulation({
  coordinates,
  cumulativeDistances,
  trafficLights,
  totalDistance,
  simulationSpeed,
  minWaitTime,
  maxWaitTime,
}: UseSimulationProps): UseSimulationResult {
  const [state, setState] = useState<SimulationState>({
    status: 'idle',
    currentPosition: [0, 0],
    currentSpeed: 0,
    elapsedTime: 0,
    distanceTraveled: 0,
    routeProgress: 0,
    currentTrafficLightIndex: 0,
    isWaitingAtLight: false,
    currentWaitTime: 0,
    totalWaitTime: 0,
    lightsEncountered: 0,
  });

  const [position, setPosition] = useState<InterpolatedPosition | null>(null);

  // Use refs for animation data to avoid recreating the animate callback
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const waitTimeTargetRef = useRef<number>(0);
  const segmentStartDistanceRef = useRef<number>(0);
  const isStoppingRef = useRef<boolean>(false);
  const isAcceleratingRef = useRef<boolean>(true); // Track if accelerating from segment start
  const waitTimesRef = useRef<number[]>([]);

  // Store current props in refs for stable animation callback
  const coordinatesRef = useRef(coordinates);
  const cumulativeDistancesRef = useRef(cumulativeDistances);
  const trafficLightsRef = useRef(trafficLights);
  const totalDistanceRef = useRef(totalDistance);
  const simulationSpeedRef = useRef(simulationSpeed);
  const minWaitTimeRef = useRef(minWaitTime);

  // Keep refs updated
  useEffect(() => {
    coordinatesRef.current = coordinates;
    cumulativeDistancesRef.current = cumulativeDistances;
    trafficLightsRef.current = trafficLights;
    totalDistanceRef.current = totalDistance;
    simulationSpeedRef.current = simulationSpeed;
    minWaitTimeRef.current = minWaitTime;
  }, [coordinates, cumulativeDistances, trafficLights, totalDistance, simulationSpeed, minWaitTime]);

  const isReady = coordinates.length > 0 && cumulativeDistances.length > 0;

  // Track route identity to detect changes
  const routeIdRef = useRef<string>('');

  // Generate wait times when traffic lights change
  useEffect(() => {
    waitTimesRef.current = trafficLights.map(() =>
      getRandomWaitTime(minWaitTime, maxWaitTime)
    );
  }, [trafficLights, minWaitTime, maxWaitTime]);

  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // Regenerate wait times on reset
    waitTimesRef.current = trafficLightsRef.current.map(() =>
      getRandomWaitTime(minWaitTimeRef.current, maxWaitTime)
    );

    const coords = coordinatesRef.current;
    const startPos = coords.length > 0
      ? { lat: coords[0][1], lng: coords[0][0], bearing: 0, segmentIndex: 0 }
      : null;

    setPosition(startPos);
    segmentStartDistanceRef.current = 0;
    isStoppingRef.current = false;
    isAcceleratingRef.current = true;
    lastTimeRef.current = 0;

    setState({
      status: 'ready',
      currentPosition: startPos ? [startPos.lat, startPos.lng] : [0, 0],
      currentSpeed: 0,
      elapsedTime: 0,
      distanceTraveled: 0,
      routeProgress: 0,
      currentTrafficLightIndex: 0,
      isWaitingAtLight: false,
      currentWaitTime: 0,
      totalWaitTime: 0,
      lightsEncountered: 0,
    });
  }, [maxWaitTime]);

  // Initialize/reset when route changes
  useEffect(() => {
    if (!isReady) {
      setState(prev => ({ ...prev, status: 'idle' }));
      return;
    }

    const coords = coordinates;
    const routeId = coords.length > 0
      ? `${coords[0][0]},${coords[0][1]}-${coords[coords.length-1][0]},${coords[coords.length-1][1]}`
      : '';

    if (routeId !== routeIdRef.current) {
      routeIdRef.current = routeId;
      reset();
    }
  }, [isReady, coordinates, reset]);

  // Stable animate function using refs
  const animate = useCallback((timestamp: number) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp;
    }

    const realDeltaTime = (timestamp - lastTimeRef.current) / 1000;
    const deltaTime = realDeltaTime * simulationSpeedRef.current;
    lastTimeRef.current = timestamp;

    const coords = coordinatesRef.current;
    const cumDist = cumulativeDistancesRef.current;
    const lights = trafficLightsRef.current;
    const totalDist = totalDistanceRef.current;

    setState((prev) => {
      if (prev.status !== 'playing') return prev;

      // Check if waiting at traffic light
      if (prev.isWaitingAtLight) {
        const newWaitTime = prev.currentWaitTime + deltaTime;

        if (newWaitTime >= waitTimeTargetRef.current) {
          segmentStartDistanceRef.current = prev.distanceTraveled;
          isStoppingRef.current = false;
          isAcceleratingRef.current = true; // Start accelerating from new segment

          return {
            ...prev,
            isWaitingAtLight: false,
            currentWaitTime: 0,
            totalWaitTime: prev.totalWaitTime + waitTimeTargetRef.current,
            elapsedTime: prev.elapsedTime + deltaTime,
            currentSpeed: 0,
          };
        }

        return {
          ...prev,
          currentWaitTime: newWaitTime,
          elapsedTime: prev.elapsedTime + deltaTime,
          currentSpeed: 0,
        };
      }

      // Calculate next traffic light distance
      const nextLight = lights[prev.currentTrafficLightIndex];
      const nextStopDistance = nextLight?.distanceFromStart ?? totalDist;
      const distanceToNextStop = nextStopDistance - prev.distanceTraveled;

      // Check if we should start braking
      const brakingDistance = 0.5 * BIKE_PHYSICS.DECELERATION_RATE * BIKE_PHYSICS.BRAKING_TIME * BIKE_PHYSICS.BRAKING_TIME;
      const shouldBrake = distanceToNextStop <= brakingDistance && nextLight;

      if (shouldBrake && !isStoppingRef.current) {
        isStoppingRef.current = true;
      }

      // Calculate current speed based on position
      const distanceFromSegmentStart = prev.distanceTraveled - segmentStartDistanceRef.current;
      const segmentDistance = nextStopDistance - segmentStartDistanceRef.current;
      const accelerationDistance = 0.5 * BIKE_PHYSICS.ACCELERATION_RATE * BIKE_PHYSICS.ACCELERATION_TIME * BIKE_PHYSICS.ACCELERATION_TIME;

      // Check if we've finished accelerating
      if (isAcceleratingRef.current && distanceFromSegmentStart >= accelerationDistance) {
        isAcceleratingRef.current = false;
      }

      const currentSpeed = calculateCurrentSpeed(
        distanceFromSegmentStart,
        segmentDistance,
        isAcceleratingRef.current,
        isStoppingRef.current
      );

      // Calculate distance traveled this frame
      // When accelerating from rest, use proper kinematics: d = 0.5 * a * t²
      // Otherwise the bike never starts moving (speed=0 when distance=0)
      let distanceDelta: number;

      if (isAcceleratingRef.current && distanceFromSegmentStart < accelerationDistance) {
        // During acceleration from rest, calculate distance using kinematics
        // Current time in acceleration = sqrt(2 * distance / acceleration)
        // New distance = 0.5 * a * (t + dt)²
        const currentAccelTime = distanceFromSegmentStart > 0
          ? Math.sqrt(2 * distanceFromSegmentStart / BIKE_PHYSICS.ACCELERATION_RATE)
          : 0;
        const newAccelTime = currentAccelTime + deltaTime;
        const maxAccelTime = BIKE_PHYSICS.ACCELERATION_TIME;

        if (newAccelTime <= maxAccelTime) {
          // Still accelerating
          const newDistance = 0.5 * BIKE_PHYSICS.ACCELERATION_RATE * newAccelTime * newAccelTime;
          distanceDelta = newDistance - distanceFromSegmentStart;
        } else {
          // Finished accelerating, now at max speed
          distanceDelta = currentSpeed * deltaTime;
        }
      } else {
        distanceDelta = currentSpeed * deltaTime;
      }
      const newDistanceTraveled = Math.min(prev.distanceTraveled + distanceDelta, totalDist);

      // Check if we've reached a traffic light
      if (nextLight && newDistanceTraveled >= nextLight.distanceFromStart) {
        waitTimeTargetRef.current = waitTimesRef.current[prev.currentTrafficLightIndex] || minWaitTimeRef.current;

        const newPos = interpolatePosition(coords, nextLight.distanceFromStart, cumDist);
        setPosition(newPos);

        return {
          ...prev,
          distanceTraveled: nextLight.distanceFromStart,
          routeProgress: nextLight.distanceFromStart / totalDist,
          elapsedTime: prev.elapsedTime + deltaTime,
          currentSpeed: 0,
          isWaitingAtLight: true,
          currentWaitTime: 0,
          currentTrafficLightIndex: prev.currentTrafficLightIndex + 1,
          lightsEncountered: prev.lightsEncountered + 1,
          currentPosition: [newPos.lat, newPos.lng],
        };
      }

      // Check if we've reached the end
      if (newDistanceTraveled >= totalDist) {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }

        const finalPos = interpolatePosition(coords, totalDist, cumDist);
        setPosition(finalPos);

        return {
          ...prev,
          status: 'finished',
          distanceTraveled: totalDist,
          routeProgress: 1,
          elapsedTime: prev.elapsedTime + deltaTime,
          currentSpeed: 0,
          currentPosition: [finalPos.lat, finalPos.lng],
        };
      }

      // Update position
      const newPos = interpolatePosition(coords, newDistanceTraveled, cumDist);
      setPosition(newPos);

      return {
        ...prev,
        distanceTraveled: newDistanceTraveled,
        routeProgress: newDistanceTraveled / totalDist,
        elapsedTime: prev.elapsedTime + deltaTime,
        currentSpeed,
        currentPosition: [newPos.lat, newPos.lng],
      };
    });

    animationRef.current = requestAnimationFrame(animate);
  }, []); // No dependencies - uses refs

  const play = useCallback(() => {
    if (!isReady) return;

    setState((prev) => {
      if (prev.status === 'finished') {
        return prev; // User should reset first
      }
      return { ...prev, status: 'playing' };
    });

    lastTimeRef.current = 0;
    animationRef.current = requestAnimationFrame(animate);
  }, [isReady, animate]);

  const pause = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setState((prev) => ({ ...prev, status: 'paused' }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    state,
    position,
    play,
    pause,
    reset,
    isReady,
  };
}
