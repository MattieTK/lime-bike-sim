import { LatLngBoundsExpression } from 'leaflet';

interface MapViewProps {
    bounds?: LatLngBoundsExpression;
    center?: [number, number];
    zoom?: number;
    children?: React.ReactNode;
}
export declare function MapView({ bounds, center, zoom, children }: MapViewProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=MapView.d.ts.map