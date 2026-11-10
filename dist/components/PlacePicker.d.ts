import type { Location } from '../types';
interface Props {
    start: Location | null;
    end: Location | null;
    picking: 'start' | 'end' | null;
    onPicking: (which: 'start' | 'end') => void;
    onStart: (place: Location | null) => void;
    onEnd: (place: Location | null) => void;
    onRoute: (start: Location, end: Location) => void;
}
export declare function PlacePicker({ start, end, picking, onPicking, onStart, onEnd, onRoute }: Props): import("react/jsx-runtime").JSX.Element;
export {};
