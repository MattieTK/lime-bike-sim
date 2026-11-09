import { LimeBikeSimulatorProps } from './types';

export type { LimeBikeSimulatorProps, Location, CostBreakdown } from './types';
export interface LimeBikeSimulatorLazyProps extends LimeBikeSimulatorProps {
    fallback?: React.ReactNode;
}
/**
 * SSR-safe version of LimeBikeSimulator.
 * This component only loads Leaflet on the client side.
 * Use with `client:only="react"` in Astro.
 */
export declare function LimeBikeSimulator({ fallback, height, ...props }: LimeBikeSimulatorLazyProps): import("react/jsx-runtime").JSX.Element;
export default LimeBikeSimulator;
//# sourceMappingURL=ssr-safe.d.ts.map