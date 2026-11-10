import 'leaflet/dist/leaflet.css';
import type { Location, RoutePlan } from '../types';
import { type Ride } from '../engine/ride';
import { type SignalPlan } from '../engine/signalModel';
export interface MapHandle {
    /** Move the rider and the lights to a moment of the ride. */
    showTime: (time: number) => void;
    /** Start following the rider again after the visitor has moved the map. */
    follow: () => void;
    /** Frame the whole route. */
    fit: () => void;
}
interface Props {
    plan: RoutePlan | null;
    ride: Ride | null;
    signalPlans: SignalPlan[];
    start?: Location;
    end?: Location;
    playing: boolean;
    /** Which end the next map click sets, or null when clicks do nothing. */
    picking: 'start' | 'end' | null;
    canMoveEnds: boolean;
    onPick?: (which: 'start' | 'end', lat: number, lng: number) => void;
    onFollowChange?: (following: boolean) => void;
    tileUrl?: string;
    tileAttribution?: string;
}
export declare const MapCanvas: import("react").ForwardRefExoticComponent<Props & import("react").RefAttributes<MapHandle>>;
export {};
