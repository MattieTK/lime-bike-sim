import { Marker } from 'react-leaflet';
import L from 'leaflet';
import type { InterpolatedPosition } from '../../types';

interface BikeMarkerProps {
  position: InterpolatedPosition | null;
  isWaiting?: boolean;
}

// Create bike icon using cyclist emoji
const createBikeIcon = (isWaiting: boolean) => {
  const borderColor = isWaiting ? '#ef4444' : '#32de84';
  const glowColor = isWaiting ? 'rgba(239, 68, 68, 0.6)' : 'rgba(50, 222, 132, 0.6)';
  const pulseAnimation = isWaiting ? 'animation: bike-pulse 1s ease-in-out infinite;' : '';

  return L.divIcon({
    className: '',
    html: `
      <style>
        @keyframes bike-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 0 12px ${glowColor}; }
          50% { transform: scale(1.1); box-shadow: 0 2px 12px rgba(0,0,0,0.4), 0 0 20px ${glowColor}; }
        }
      </style>
      <div style="
        width: 36px;
        height: 36px;
        background: white;
        border-radius: 50%;
        border: 3px solid ${borderColor};
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3), 0 0 12px ${glowColor};
        ${pulseAnimation}
      ">🚴</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

export function BikeMarker({ position, isWaiting = false }: BikeMarkerProps) {
  if (!position) return null;

  const icon = createBikeIcon(isWaiting);

  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={icon}
      zIndexOffset={1000}
    />
  );
}
