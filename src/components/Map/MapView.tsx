import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import type { LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  bounds?: LatLngBoundsExpression;
  center?: [number, number];
  zoom?: number;
  followPosition?: { lat: number; lng: number } | null;
  isFollowing?: boolean;
  children?: React.ReactNode;
}

// Component to handle map bounds updates (initial fit)
function MapBoundsUpdater({ bounds }: { bounds?: LatLngBoundsExpression }) {
  const map = useMap();
  const hasFittedRef = useRef(false);

  useEffect(() => {
    if (bounds && !hasFittedRef.current) {
      map.fitBounds(bounds, { padding: [50, 50] });
      hasFittedRef.current = true;
    }
  }, [map, bounds]);

  return null;
}

// Component to follow cyclist position
function PositionFollower({
  position,
  isFollowing,
}: {
  position?: { lat: number; lng: number } | null;
  isFollowing?: boolean;
}) {
  const map = useMap();
  const hasZoomedIn = useRef(false);

  useEffect(() => {
    if (!isFollowing || !position) {
      hasZoomedIn.current = false;
      return;
    }

    // Zoom in when starting to follow
    if (!hasZoomedIn.current) {
      map.setView([position.lat, position.lng], 16, { animate: true, duration: 0.5 });
      hasZoomedIn.current = true;
    } else {
      // Smoothly pan to keep cyclist centered
      map.panTo([position.lat, position.lng], { animate: true, duration: 0.1 });
    }
  }, [map, position, isFollowing]);

  return null;
}

// Default London center
const LONDON_CENTER: [number, number] = [51.5074, -0.1278];
const DEFAULT_ZOOM = 13;

export function MapView({
  bounds,
  center,
  zoom,
  followPosition,
  isFollowing,
  children,
}: MapViewProps) {
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
      <PositionFollower position={followPosition} isFollowing={isFollowing} />
      {children}
    </MapContainer>
  );
}
