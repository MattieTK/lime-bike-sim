import { CircleMarker, Popup } from 'react-leaflet';
import type { TrafficLight } from '../../types';

interface TrafficLightMarkersProps {
  trafficLights: TrafficLight[];
  currentIndex: number; // Index of next traffic light (lights before this have been passed)
  isWaitingAtLight: boolean;
}

export function TrafficLightMarkers({
  trafficLights,
  currentIndex,
  isWaitingAtLight,
}: TrafficLightMarkersProps) {
  return (
    <>
      {trafficLights.map((light, index) => {
        const isPassed = index < currentIndex - (isWaitingAtLight ? 0 : 1);
        const isCurrentlyWaiting = isWaitingAtLight && index === currentIndex - 1;
        const isUpcoming = index >= currentIndex;

        let color = '#6b7280'; // Gray for passed
        if (isCurrentlyWaiting) {
          color = '#ef4444'; // Red for currently waiting
        } else if (isUpcoming) {
          color = '#f59e0b'; // Amber for upcoming
        }

        return (
          <CircleMarker
            key={light.id}
            center={[light.lat, light.lng]}
            radius={6}
            pathOptions={{
              color: color,
              fillColor: color,
              fillOpacity: isPassed ? 0.4 : 0.8,
              weight: 2,
            }}
          >
            <Popup>
              <div>
                <strong>Traffic Light #{index + 1}</strong>
                <br />
                {isPassed && <span style={{ color: '#6b7280' }}>Passed</span>}
                {isCurrentlyWaiting && <span style={{ color: '#ef4444' }}>Waiting...</span>}
                {isUpcoming && !isCurrentlyWaiting && <span style={{ color: '#f59e0b' }}>Ahead</span>}
                <br />
                <small>{Math.round(light.distanceFromStart)}m from start</small>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
}
