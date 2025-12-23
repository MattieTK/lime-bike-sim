import type { Location, OSRMResponse, Route } from '../types';

const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/bike';

export async function fetchRoute(start: Location, end: Location): Promise<Route> {
  const url = `${OSRM_BASE_URL}/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&steps=true`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`OSRM request failed: ${response.statusText}`);
  }

  const data: OSRMResponse = await response.json();

  if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
    throw new Error('No route found between the specified locations');
  }

  return data.routes[0];
}

// Calculate distance between two coordinates using Haversine formula
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // meters
}

// Calculate cumulative distances along a route
export function calculateCumulativeDistances(coordinates: [number, number][]): number[] {
  const distances: number[] = [0];

  for (let i = 1; i < coordinates.length; i++) {
    const [lng1, lat1] = coordinates[i - 1];
    const [lng2, lat2] = coordinates[i];
    const segmentDistance = haversineDistance(lat1, lng1, lat2, lng2);
    distances.push(distances[i - 1] + segmentDistance);
  }

  return distances;
}
