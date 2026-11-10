import type { LimeBikeSimulatorProps } from './types';
export interface LimeBikeSimulatorLazyProps extends LimeBikeSimulatorProps {
    fallback?: React.ReactNode;
}
/**
 * SSR-safe version of LimeBikeSimulator.
 * Use this with `client:only="react"` in Astro or similar SSR frameworks.
 */
export declare function LimeBikeSimulatorLazy({ fallback, height, ...props }: LimeBikeSimulatorLazyProps): import("react/jsx-runtime").JSX.Element;
