import type { Location } from '../types';
export interface Place extends Location {
    label: string;
    /** Area or postcode, to tell similar names apart. */
    context: string;
}
export declare function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]>;
/** A name for a pin dropped on the map. Falls back to null if nothing is nearby. */
export declare function nameOf(lat: number, lng: number, signal?: AbortSignal): Promise<string | null>;
export declare const EXAMPLE_ROUTES: {
    name: string;
    start: Location;
    end: Location;
}[];
