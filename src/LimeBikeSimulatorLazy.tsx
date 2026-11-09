import { lazy, Suspense } from 'react';
import type { LimeBikeSimulatorProps } from './types';

// Lazy load the actual component to avoid SSR issues with Leaflet
const LimeBikeSimulatorCore = lazy(() =>
  import('./LimeBikeSimulator').then((m) => ({ default: m.LimeBikeSimulator }))
);

export interface LimeBikeSimulatorLazyProps extends LimeBikeSimulatorProps {
  fallback?: React.ReactNode;
}

/**
 * SSR-safe version of LimeBikeSimulator.
 * Use this with `client:only="react"` in Astro or similar SSR frameworks.
 */
export function LimeBikeSimulatorLazy({
  fallback,
  height = 600,
  ...props
}: LimeBikeSimulatorLazyProps) {
  const defaultFallback = (
    <div
      style={{
        height: typeof height === 'number' ? height : 600,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        fontSize: 14,
      }}
    >
      Loading map...
    </div>
  );

  return (
    <Suspense fallback={fallback ?? defaultFallback}>
      <LimeBikeSimulatorCore height={height} {...props} />
    </Suspense>
  );
}
