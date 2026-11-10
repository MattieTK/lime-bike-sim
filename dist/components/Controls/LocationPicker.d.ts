import { Location } from '../../types';

interface LocationPickerProps {
    startLocation: Location | null;
    endLocation: Location | null;
    onStartChange: (location: Location) => void;
    onEndChange: (location: Location) => void;
    isEnabled: boolean;
}
type PickerMode = 'start' | 'end' | null;
export declare function LocationPickerOverlay({ startLocation, endLocation, onStartChange, onEndChange, isEnabled, pickerMode, onModeChange, }: LocationPickerProps & {
    pickerMode: PickerMode;
    onModeChange: (mode: PickerMode) => void;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function LocationPickerUI({ startLocation, endLocation, pickerMode, onModeChange, onClear, }: {
    startLocation: Location | null;
    endLocation: Location | null;
    pickerMode: PickerMode;
    onModeChange: (mode: PickerMode) => void;
    onClear: () => void;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=LocationPicker.d.ts.map