import type { TrafficLight, OverpassResponse } from '../types';
import { haversineDistance } from './osrm';

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

// Fetch traffic lights near a route
export async function fetchTrafficLights(
  coordinates: [number, number][], // [lng, lat]
  bufferMeters: number = 30
): Promise<TrafficLight[]> {
  // Sample the route to reduce query size (every ~100m)
  const sampledCoords = sampleCoordinates(coordinates, 100);

  // Build Overpass query - search around route points
  const coordsStr = sampledCoords
    .map(([lng, lat]) => `${lat},${lng}`)
    .join(',');

  // Query for traffic signals near the route
  const query = `
    [out:json][timeout:30];
    (
      node["highway"="traffic_signals"](around:${bufferMeters},${coordsStr});
    );
    out body;
  `;

  const response = await fetch(OVERPASS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) {
    throw new Error(`Overpass API request failed: ${response.statusText}`);
  }

  const data: OverpassResponse = await response.json();

  // Convert to our TrafficLight type and find closest route point
  const trafficLights = data.elements
    .filter((el) => el.type === 'node')
    .map((node) => {
      const { closestIndex, distance, distanceFromStart } = findClosestRoutePoint(
        node.lat,
        node.lon,
        coordinates
      );

      // Only include if within buffer distance of route
      if (distance > bufferMeters) {
        return null;
      }

      return {
        id: node.id,
        lat: node.lat,
        lng: node.lon,
        routeIndex: closestIndex,
        distanceFromStart,
      };
    })
    .filter((tl): tl is TrafficLight => tl !== null);

  // Sort by distance from start and remove duplicates (lights very close together)
  return deduplicateTrafficLights(trafficLights);
}

// Sample coordinates to reduce query size
function sampleCoordinates(
  coordinates: [number, number][],
  intervalMeters: number
): [number, number][] {
  if (coordinates.length <= 2) return coordinates;

  const sampled: [number, number][] = [coordinates[0]];
  let accumulatedDistance = 0;

  for (let i = 1; i < coordinates.length; i++) {
    const [lng1, lat1] = coordinates[i - 1];
    const [lng2, lat2] = coordinates[i];
    accumulatedDistance += haversineDistance(lat1, lng1, lat2, lng2);

    if (accumulatedDistance >= intervalMeters) {
      sampled.push(coordinates[i]);
      accumulatedDistance = 0;
    }
  }

  // Always include last point
  if (sampled[sampled.length - 1] !== coordinates[coordinates.length - 1]) {
    sampled.push(coordinates[coordinates.length - 1]);
  }

  return sampled;
}

// Find closest point on route to a traffic light
function findClosestRoutePoint(
  lat: number,
  lng: number,
  coordinates: [number, number][]
): { closestIndex: number; distance: number; distanceFromStart: number } {
  let closestIndex = 0;
  let minDistance = Infinity;
  let distanceFromStart = 0;
  let accumulatedDistance = 0;

  for (let i = 0; i < coordinates.length; i++) {
    const [coordLng, coordLat] = coordinates[i];
    const distance = haversineDistance(lat, lng, coordLat, coordLng);

    if (distance < minDistance) {
      minDistance = distance;
      closestIndex = i;
      distanceFromStart = accumulatedDistance;
    }

    if (i > 0) {
      const [prevLng, prevLat] = coordinates[i - 1];
      accumulatedDistance += haversineDistance(prevLat, prevLng, coordLat, coordLng);
    }
  }

  return { closestIndex, distance: minDistance, distanceFromStart };
}

// Remove traffic lights that are too close together (likely same intersection)
function deduplicateTrafficLights(lights: TrafficLight[]): TrafficLight[] {
  const sorted = [...lights].sort((a, b) => a.distanceFromStart - b.distanceFromStart);
  const deduplicated: TrafficLight[] = [];
  const MIN_DISTANCE_BETWEEN_LIGHTS = 50; // meters

  for (const light of sorted) {
    const lastLight = deduplicated[deduplicated.length - 1];
    if (!lastLight || light.distanceFromStart - lastLight.distanceFromStart >= MIN_DISTANCE_BETWEEN_LIGHTS) {
      deduplicated.push(light);
    }
  }

  return deduplicated;
}
