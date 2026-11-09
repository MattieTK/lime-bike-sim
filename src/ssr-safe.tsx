import { useState, useEffect } from 'react';
import type { LimeBikeSimulatorProps } from './types';

// Re-export types for convenience
export type { LimeBikeSimulatorProps, Location, CostBreakdown } from './types';

export interface LimeBikeSimulatorLazyProps extends LimeBikeSimulatorProps {
  fallback?: React.ReactNode;
}

/**
 * SSR-safe version of LimeBikeSimulator.
 * This component only loads Leaflet on the client side.
 * Use with `client:only="react"` in Astro.
 */
export function LimeBikeSimulator({
  fallback,
  height = 600,
  ...props
}: LimeBikeSimulatorLazyProps) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    // Dynamic import only happens on client
    import('./LimeBikeSimulator').then((mod) => {
      setComponent(() => mod.LimeBikeSimulator);
    });
    // Also load styles
    import('./styles/LimeBikeSimulator.module.css');
  }, []);

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

  if (!Component) {
    return <>{fallback ?? defaultFallback}</>;
  }

  return <Component height={height} {...props} />;
}

export default LimeBikeSimulator;
