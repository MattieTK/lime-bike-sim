import { Effect, Schedule, pipe } from 'effect';
import type { TrafficLight, OverpassResponse } from '../types';
import { haversineDistance } from './osrm';

// Multiple Overpass API endpoints for failover
// Order matters: we try them in sequence until one succeeds
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',           // Main instance (Germany)
  'https://overpass.private.coffee/api/interpreter',   // No rate limit (Global)
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter', // VK Maps (Russia) - no rate limit
  'https://overpass.osm.jp/api/interpreter',           // Japan instance (Global)
] as const;

// Configuration for chunking and retries
const CONFIG = {
  CHUNK_DISTANCE_METERS: 500, // Split route every 500m for separate queries
  BUFFER_METERS: 30, // Search radius around route
  SAMPLE_INTERVAL_METERS: 100, // Sample coordinates every 100m within chunk
  MIN_DISTANCE_BETWEEN_LIGHTS: 50, // Dedupe lights closer than this
  MAX_RETRIES_PER_ENDPOINT: 2, // Retries per endpoint before trying next
  INITIAL_RETRY_DELAY_MS: 500, // Start with 500ms delay
  MAX_CONCURRENT_REQUESTS: 3, // Limit concurrent requests to avoid rate limiting
  REQUEST_TIMEOUT_MS: 15000, // 15 second timeout per request
} as const;

// Error types for better error handling
class OverpassApiError {
  readonly _tag = 'OverpassApiError';
  constructor(
    readonly message: string,
    readonly statusCode?: number
  ) {}

  // 429 = rate limited, should immediately try next endpoint
  // 4xx = client errors, unlikely to succeed on retry
  get shouldFailover(): boolean {
    return this.statusCode !== undefined && this.statusCode >= 400 && this.statusCode < 500;
  }

  // 5xx = server errors, might succeed on retry
  get isRetryable(): boolean {
    return this.statusCode === undefined || this.statusCode >= 500;
  }
}

class NetworkError {
  readonly _tag = 'NetworkError';
  constructor(readonly cause: unknown) {}

  // Network errors are retryable (might be transient)
  get shouldFailover(): boolean {
    return false;
  }

  get isRetryable(): boolean {
    return true;
  }
}

type TrafficLightError = OverpassApiError | NetworkError;

// Sample coordinates to reduce query size within a chunk
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

// Split route into chunks of approximately CHUNK_DISTANCE_METERS
function chunkRoute(
  coordinates: [number, number][]
): [number, number][][] {
  if (coordinates.length <= 2) return [coordinates];

  const chunks: [number, number][][] = [];
  let currentChunk: [number, number][] = [coordinates[0]];
  let chunkDistance = 0;

  for (let i = 1; i < coordinates.length; i++) {
    const [lng1, lat1] = coordinates[i - 1];
    const [lng2, lat2] = coordinates[i];
    const segmentDistance = haversineDistance(lat1, lng1, lat2, lng2);

    currentChunk.push(coordinates[i]);
    chunkDistance += segmentDistance;

    if (chunkDistance >= CONFIG.CHUNK_DISTANCE_METERS && i < coordinates.length - 1) {
      chunks.push(currentChunk);
      // Start new chunk with overlap (last point of previous chunk)
      currentChunk = [coordinates[i]];
      chunkDistance = 0;
    }
  }

  // Add final chunk
  if (currentChunk.length > 0) {
    chunks.push(currentChunk);
  }

  return chunks;
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

  for (const light of sorted) {
    const lastLight = deduplicated[deduplicated.length - 1];
    if (
      !lastLight ||
      light.distanceFromStart - lastLight.distanceFromStart >= CONFIG.MIN_DISTANCE_BETWEEN_LIGHTS
    ) {
      deduplicated.push(light);
    }
  }

  return deduplicated;
}

// Build the Overpass query for a chunk
function buildOverpassQuery(chunkCoords: [number, number][]): string {
  const sampledCoords = sampleCoordinates(chunkCoords, CONFIG.SAMPLE_INTERVAL_METERS);
  const coordsStr = sampledCoords
    .map(([lng, lat]) => `${lat},${lng}`)
    .join(',');

  return `
    [out:json][timeout:30];
    (
      node["highway"="traffic_signals"](around:${CONFIG.BUFFER_METERS},${coordsStr});
    );
    out body;
  `;
}

// Fetch from a single endpoint with timeout
function fetchFromEndpoint(
  endpoint: string,
  query: string
): Effect.Effect<OverpassResponse, TrafficLightError> {
  return Effect.tryPromise({
    try: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT_MS);

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `data=${encodeURIComponent(query)}`,
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new OverpassApiError(
            `${endpoint}: ${response.statusText}`,
            response.status
          );
        }

        return (await response.json()) as OverpassResponse;
      } finally {
        clearTimeout(timeoutId);
      }
    },
    catch: (error) => {
      if (error instanceof OverpassApiError) {
        return error;
      }
      return new NetworkError(error);
    },
  });
}

// Create exponential backoff schedule for retries within an endpoint
const endpointRetrySchedule = pipe(
  Schedule.exponential(CONFIG.INITIAL_RETRY_DELAY_MS),
  Schedule.intersect(Schedule.recurs(CONFIG.MAX_RETRIES_PER_ENDPOINT))
);

// Try a single endpoint with retries (only for retryable errors)
function tryEndpointWithRetry(
  endpoint: string,
  query: string
): Effect.Effect<OverpassResponse, TrafficLightError> {
  return pipe(
    fetchFromEndpoint(endpoint, query),
    // Only retry if the error is retryable (5xx, network errors)
    // Immediately fail (and thus failover) on 429 and other 4xx
    Effect.retry({
      schedule: endpointRetrySchedule,
      while: (error) => error.isRetryable,
    }),
    Effect.tapError((error) =>
      Effect.sync(() => {
        if (error.shouldFailover) {
          console.warn(
            `Endpoint ${endpoint} returned ${error instanceof OverpassApiError ? error.statusCode : 'error'}, immediately trying next...`
          );
        } else {
          console.warn(`Endpoint ${endpoint} failed after retries, trying next...`);
        }
      })
    )
  );
}

// Try all endpoints in sequence until one succeeds
function fetchWithFailover(
  query: string
): Effect.Effect<OverpassResponse, TrafficLightError> {
  // Create an effect that tries each endpoint in sequence
  const tryEndpoints = OVERPASS_ENDPOINTS.reduce(
    (acc, endpoint) =>
      pipe(
        acc,
        Effect.catchAll(() => tryEndpointWithRetry(endpoint, query))
      ),
    // Start with a failing effect to kick off the chain
    Effect.fail(new NetworkError('No endpoints configured')) as Effect.Effect<
      OverpassResponse,
      TrafficLightError
    >
  );

  return tryEndpoints;
}

// Convert Overpass response to TrafficLight array
function parseTrafficLights(
  data: OverpassResponse,
  fullRouteCoords: [number, number][]
): TrafficLight[] {
  return data.elements
    .filter((el) => el.type === 'node')
    .map((node) => {
      const { closestIndex, distance, distanceFromStart } = findClosestRoutePoint(
        node.lat,
        node.lon,
        fullRouteCoords
      );

      // Only include if within buffer distance of route
      if (distance > CONFIG.BUFFER_METERS) {
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
}

// Fetch traffic lights for a single chunk with multi-endpoint failover
function fetchChunkTrafficLights(
  chunkCoords: [number, number][],
  fullRouteCoords: [number, number][]
): Effect.Effect<TrafficLight[], TrafficLightError> {
  const query = buildOverpassQuery(chunkCoords);

  return pipe(
    fetchWithFailover(query),
    Effect.map((data) => parseTrafficLights(data, fullRouteCoords))
  );
}

// Fetch traffic lights for a chunk, returning empty array on total failure
function fetchChunkWithRetry(
  chunkCoords: [number, number][],
  fullRouteCoords: [number, number][],
  chunkIndex: number
): Effect.Effect<TrafficLight[], never> {
  return pipe(
    fetchChunkTrafficLights(chunkCoords, fullRouteCoords),
    Effect.tap(() =>
      Effect.sync(() => {
        console.log(`Chunk ${chunkIndex} completed successfully`);
      })
    ),
    Effect.tapError((error) =>
      Effect.sync(() => {
        console.warn(`Chunk ${chunkIndex} failed on all endpoints:`, error);
      })
    ),
    // If all endpoints fail, return empty array for this chunk
    Effect.catchAll(() => Effect.succeed([] as TrafficLight[]))
  );
}

// Main function: fetch all traffic lights with chunking, parallelism, and retries
export function fetchTrafficLightsEffect(
  coordinates: [number, number][]
): Effect.Effect<TrafficLight[], never> {
  if (coordinates.length === 0) {
    return Effect.succeed([]);
  }

  const chunks = chunkRoute(coordinates);

  // Create effects for each chunk
  const chunkEffects = chunks.map((chunk, index) =>
    fetchChunkWithRetry(chunk, coordinates, index)
  );

  return pipe(
    // Run chunks with controlled concurrency
    Effect.all(chunkEffects, { concurrency: CONFIG.MAX_CONCURRENT_REQUESTS }),
    // Flatten results from all chunks
    Effect.map((results) => results.flat()),
    // Deduplicate (chunks may have overlapping results)
    Effect.map(deduplicateTrafficLights),
    Effect.tap((lights) =>
      Effect.sync(() => {
        console.log(
          `Fetched ${lights.length} traffic lights from ${chunks.length} chunks`
        );
      })
    )
  );
}

// Helper to run the Effect and get a Promise (for use in React)
export function runFetchTrafficLights(
  coordinates: [number, number][]
): Promise<TrafficLight[]> {
  return Effect.runPromise(fetchTrafficLightsEffect(coordinates));
}
