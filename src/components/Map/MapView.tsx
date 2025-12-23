import { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import type { LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  bounds?: LatLngBoundsExpression;
  center?: [number, number];
  zoom?: number;
  children?: React.ReactNode;
}

// Component to handle map bounds updates
function MapBoundsUpdater({ bounds }: { bounds?: LatLngBoundsExpression }) {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, bounds]);

  return null;
}

// Default London center
const LONDON_CENTER: [number, number] = [51.5074, -0.1278];
const DEFAULT_ZOOM = 13;

export function MapView({ bounds, center, zoom, children }: MapViewProps) {
  return (
    <MapContainer
      center={center || LONDON_CENTER}
      zoom={zoom || DEFAULT_ZOOM}
      style={{ width: '100%', height: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapBoundsUpdater bounds={bounds} />
      {children}
    </MapContainer>
  );
}
