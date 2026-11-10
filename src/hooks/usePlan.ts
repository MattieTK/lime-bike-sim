import { useEffect, useMemo, useState } from 'react';
import type { Location, PrecomputedRoute, RoutePlan } from '../types';
import { buildPlan, planFromPrecomputed } from '../engine/plan';

export interface PlanState {
  plan: RoutePlan | null;
  loading: boolean;
  error: string | null;
}

/** Loads the route and its traffic lights whenever the two ends change. */
export function usePlan(
  start: Location | undefined,
  end: Location | undefined,
  precomputed: PrecomputedRoute | undefined
): PlanState {
  const fixed = useMemo(
    () => (precomputed ? planFromPrecomputed(precomputed) : null),
    [precomputed]
  );
  const [state, setState] = useState<PlanState>({ plan: null, loading: false, error: null });

  const startLat = start?.lat;
  const startLng = start?.lng;
  const endLat = end?.lat;
  const endLng = end?.lng;

  useEffect(() => {
    if (fixed) return;
    if (startLat == null || startLng == null || endLat == null || endLng == null) {
      setState({ plan: null, loading: false, error: null });
      return;
    }
    const controller = new AbortController();
    setState((prev) => ({ plan: prev.plan, loading: true, error: null }));
    buildPlan(
      { lat: startLat, lng: startLng },
      { lat: endLat, lng: endLng },
      controller.signal
    ).then(
      (plan) => {
        if (!controller.signal.aborted) setState({ plan, loading: false, error: null });
      },
      (err: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          plan: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Could not load that route.',
        });
      }
    );
    return () => controller.abort();
  }, [fixed, startLat, startLng, endLat, endLng]);

  return fixed ? { plan: fixed, loading: false, error: null } : state;
}
