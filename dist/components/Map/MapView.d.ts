import { LatLngBoundsExpression } from 'leaflet';

interface MapViewProps {
    bounds?: LatLngBoundsExpression;
    center?: [number, number];
    zoom?: number;
    followPosition?: {
        lat: number;
        lng: number;
    } | null;
    isFollowing?: boolean;
    children?: React.ReactNode;
}
export declare function MapView({ bounds, center, zoom, followPosition, isFollowing, children, }: MapViewProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=MapView.d.ts.map