import { Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Location } from '../../types';

interface RouteLayerProps {
  coordinates: [number, number][]; // [lng, lat]
  startLocation?: Location;
  endLocation?: Location;
}

// Convert [lng, lat] to [lat, lng] for Leaflet
function toLatLng(coords: [number, number][]): [number, number][] {
  return coords.map(([lng, lat]) => [lat, lng]);
}

// Custom marker icons
const startIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    background: #22c55e;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 12px;
  ">A</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const endIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div style="
    background: #ef4444;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 12px;
  ">B</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export function RouteLayer({ coordinates, startLocation, endLocation }: RouteLayerProps) {
  if (coordinates.length === 0) return null;

  const latLngCoords = toLatLng(coordinates);

  return (
    <>
      {/* Route line */}
      <Polyline
        positions={latLngCoords}
        pathOptions={{
          color: '#32de84', // Lime green
          weight: 5,
          opacity: 0.8,
        }}
      />

      {/* Start marker */}
      {startLocation && (
        <Marker position={[startLocation.lat, startLocation.lng]} icon={startIcon}>
          <Popup>
            <strong>Start:</strong> {startLocation.label || 'Starting point'}
          </Popup>
        </Marker>
      )}

      {/* End marker */}
      {endLocation && (
        <Marker position={[endLocation.lat, endLocation.lng]} icon={endIcon}>
          <Popup>
            <strong>End:</strong> {endLocation.label || 'Destination'}
          </Popup>
        </Marker>
      )}
    </>
  );
}
