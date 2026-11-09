import { SimulationStatus } from '../../types';

interface SimulationControlsProps {
    status: SimulationStatus;
    onPlay: () => void;
    onPause: () => void;
    onReset: () => void;
    isReady: boolean;
    simulationSpeed: number;
    onSpeedChange?: (speed: number) => void;
    hideProgress?: boolean;
}
export declare function SimulationControls({ status, onPlay, onPause, onReset, isReady, simulationSpeed, onSpeedChange, hideProgress, }: SimulationControlsProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SimulationControls.d.ts.map