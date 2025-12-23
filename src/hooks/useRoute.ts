import { useState, useEffect, useCallback } from 'react';
import type { Location, Route } from '../types';
import { fetchRoute, calculateCumulativeDistances } from '../services/osrm';

interface UseRouteResult {
  route: Route | null;
  coordinates: [number, number][];
  cumulativeDistances: number[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useRoute(
  startLocation: Location | undefined,
  endLocation: Location | undefined
): UseRouteResult {
  const [route, setRoute] = useState<Route | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number][]>([]);
  const [cumulativeDistances, setCumulativeDistances] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!startLocation || !endLocation) {
      setRoute(null);
      setCoordinates([]);
      setCumulativeDistances([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fetchedRoute = await fetchRoute(startLocation, endLocation);
      setRoute(fetchedRoute);

      const coords = fetchedRoute.geometry.coordinates as [number, number][];
      setCoordinates(coords);
      setCumulativeDistances(calculateCumulativeDistances(coords));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch route');
      setRoute(null);
      setCoordinates([]);
      setCumulativeDistances([]);
    } finally {
      setIsLoading(false);
    }
  }, [startLocation, endLocation]);

  // Auto-fetch on mount when locations are provided
  useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    route,
    coordinates,
    cumulativeDistances,
    isLoading,
    error,
    refetch: fetch,
  };
}
