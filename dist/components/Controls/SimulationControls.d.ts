import { SimulationStatus } from '../../types';

interface SimulationControlsProps {
    status: SimulationStatus;
    onPlay: () => void;
    onPause: () => void;
    onReset: () => void;
    isReady: boolean;
    simulationSpeed: number;
    onSpeedChange?: (speed: number) => void;
}
export declare function SimulationControls({ status, onPlay, onPause, onReset, isReady, simulationSpeed, onSpeedChange, }: SimulationControlsProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SimulationControls.d.ts.map