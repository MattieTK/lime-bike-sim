import type { InterpolatedPosition, RouteSegment, TrafficLight } from '../types';
import { BIKE_PHYSICS } from '../types';
import { haversineDistance } from './osrm';

// Convert route coordinates to segments between traffic lights
export function createRouteSegments(
  coordinates: [number, number][],
  trafficLights: TrafficLight[]
): RouteSegment[] {
  const segments: RouteSegment[] = [];
  let startIndex = 0;

  // Sort traffic lights by route index
  const sortedLights = [...trafficLights].sort((a, b) => a.routeIndex - b.routeIndex);

  for (const light of sortedLights) {
    const endIndex = light.routeIndex;
    if (endIndex > startIndex) {
      segments.push({
        startIndex,
        endIndex,
        coordinates: coordinates.slice(startIndex, endIndex + 1),
        distance: calculateSegmentDistance(coordinates, startIndex, endIndex),
        hasTrafficLightAtEnd: true,
        trafficLightId: light.id,
      });
      startIndex = endIndex;
    }
  }

  // Final segment to destination
  if (startIndex < coordinates.length - 1) {
    segments.push({
      startIndex,
      endIndex: coordinates.length - 1,
      coordinates: coordinates.slice(startIndex),
      distance: calculateSegmentDistance(coordinates, startIndex, coordinates.length - 1),
      hasTrafficLightAtEnd: false,
    });
  }

  return segments;
}

function calculateSegmentDistance(
  coordinates: [number, number][],
  startIndex: number,
  endIndex: number
): number {
  let distance = 0;
  for (let i = startIndex; i < endIndex; i++) {
    const [lng1, lat1] = coordinates[i];
    const [lng2, lat2] = coordinates[i + 1];
    distance += haversineDistance(lat1, lng1, lat2, lng2);
  }
  return distance;
}

// Calculate time to travel a distance with acceleration/braking physics
export function calculateTravelTime(
  distance: number,
  startFromStop: boolean,
  endAtStop: boolean
): number {
  const { MAX_SPEED_MS, ACCELERATION_TIME, BRAKING_TIME, ACCELERATION_RATE, DECELERATION_RATE } = BIKE_PHYSICS;

  // Distance covered during acceleration (from 0 to max speed)
  // d = 0.5 * a * t^2
  const accelerationDistance = 0.5 * ACCELERATION_RATE * ACCELERATION_TIME * ACCELERATION_TIME;

  // Distance covered during braking (from max speed to 0)
  const brakingDistance = 0.5 * DECELERATION_RATE * BRAKING_TIME * BRAKING_TIME;

  let totalTime = 0;
  let remainingDistance = distance;

  if (startFromStop) {
    if (remainingDistance <= accelerationDistance) {
      // Never reaches max speed
      // d = 0.5 * a * t^2, so t = sqrt(2d/a)
      return Math.sqrt((2 * remainingDistance) / ACCELERATION_RATE);
    }
    totalTime += ACCELERATION_TIME;
    remainingDistance -= accelerationDistance;
  }

  if (endAtStop) {
    if (remainingDistance <= brakingDistance) {
      // Already accounted for acceleration, now just braking
      // Need to decelerate from current speed
      if (startFromStop) {
        // We accelerated and now need to brake immediately
        // This is a complex case - simplified calculation
        return totalTime + Math.sqrt((2 * remainingDistance) / DECELERATION_RATE);
      }
      return Math.sqrt((2 * remainingDistance) / DECELERATION_RATE);
    }
    totalTime += BRAKING_TIME;
    remainingDistance -= brakingDistance;
  }

  // Cruise at max speed for remaining distance
  if (remainingDistance > 0) {
    totalTime += remainingDistance / MAX_SPEED_MS;
  }

  return totalTime;
}

// Interpolate position along route based on distance traveled
export function interpolatePosition(
  coordinates: [number, number][],
  distanceTraveled: number,
  cumulativeDistances: number[]
): InterpolatedPosition {
  // Find which segment we're on
  let segmentIndex = 0;
  for (let i = 1; i < cumulativeDistances.length; i++) {
    if (cumulativeDistances[i] >= distanceTraveled) {
      segmentIndex = i - 1;
      break;
    }
    segmentIndex = i - 1;
  }

  // Handle end of route
  if (segmentIndex >= coordinates.length - 1) {
    const [lng, lat] = coordinates[coordinates.length - 1];
    const prevCoord = coordinates[coordinates.length - 2] || coordinates[coordinates.length - 1];
    return {
      lat,
      lng,
      bearing: calculateBearing(prevCoord[1], prevCoord[0], lat, lng),
      segmentIndex: coordinates.length - 1,
    };
  }

  const segmentStart = cumulativeDistances[segmentIndex];
  const segmentEnd = cumulativeDistances[segmentIndex + 1];
  const segmentLength = segmentEnd - segmentStart;

  // Calculate position within segment
  const distanceIntoSegment = distanceTraveled - segmentStart;
  const t = segmentLength > 0 ? Math.min(1, distanceIntoSegment / segmentLength) : 0;

  const [lng1, lat1] = coordinates[segmentIndex];
  const [lng2, lat2] = coordinates[segmentIndex + 1];

  // Linear interpolation
  const lat = lat1 + t * (lat2 - lat1);
  const lng = lng1 + t * (lng2 - lng1);
  const bearing = calculateBearing(lat1, lng1, lat2, lng2);

  return { lat, lng, bearing, segmentIndex };
}

// Calculate bearing between two points (for bike rotation)
export function calculateBearing(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  const theta = Math.atan2(y, x);
  return ((theta * 180) / Math.PI + 360) % 360; // Normalize to 0-360
}

// Calculate speed at a given point in journey (with acceleration/braking)
export function calculateCurrentSpeed(
  distanceFromSegmentStart: number,
  segmentDistance: number,
  isStartingFromStop: boolean,
  isStoppingAtEnd: boolean
): number {
  const { MAX_SPEED_MS, ACCELERATION_RATE, DECELERATION_RATE, ACCELERATION_TIME, BRAKING_TIME } = BIKE_PHYSICS;

  const accelerationDistance = 0.5 * ACCELERATION_RATE * ACCELERATION_TIME * ACCELERATION_TIME;
  const brakingDistance = 0.5 * DECELERATION_RATE * BRAKING_TIME * BRAKING_TIME;
  const distanceToEnd = segmentDistance - distanceFromSegmentStart;

  // Check if we're still accelerating
  if (isStartingFromStop && distanceFromSegmentStart < accelerationDistance) {
    // v = sqrt(2 * a * d)
    return Math.sqrt(2 * ACCELERATION_RATE * distanceFromSegmentStart);
  }

  // Check if we're braking
  if (isStoppingAtEnd && distanceToEnd < brakingDistance) {
    // v = sqrt(2 * a * d) where d is remaining distance
    return Math.sqrt(2 * DECELERATION_RATE * distanceToEnd);
  }

  // Cruising at max speed
  return MAX_SPEED_MS;
}
