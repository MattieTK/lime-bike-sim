import { CircleMarker, Popup } from 'react-leaflet';
import type { TrafficLight } from '../../types';
import { getTrafficLightPhase } from '../../types';

interface TrafficLightMarkersProps {
  trafficLights: TrafficLight[];
  currentIndex: number; // Index of next traffic light (lights before this have been passed)
  isWaitingAtLight: boolean;
  elapsedTime: number; // Simulation elapsed time for calculating light phases
}

// Colors for each light phase
const PHASE_COLORS = {
  red: '#ef4444',
  yellow: '#f59e0b',
  green: '#22c55e',
  passed: '#6b7280',
} as const;

export function TrafficLightMarkers({
  trafficLights,
  currentIndex,
  isWaitingAtLight,
  elapsedTime,
}: TrafficLightMarkersProps) {
  return (
    <>
      {trafficLights.map((light, index) => {
        const isPassed = index < currentIndex - (isWaitingAtLight ? 0 : 1);
        const isCurrentlyWaiting = isWaitingAtLight && index === currentIndex - 1;
        const isUpcoming = index >= currentIndex;

        // Determine light color based on current phase
        let color: string;
        let phaseLabel: string;

        if (isPassed) {
          color = PHASE_COLORS.passed;
          phaseLabel = 'Passed';
        } else if (isCurrentlyWaiting) {
          // Currently waiting - show red
          color = PHASE_COLORS.red;
          phaseLabel = 'Waiting...';
        } else if (isUpcoming) {
          // Upcoming lights - show their actual current phase
          const phase = getTrafficLightPhase(light.timing, elapsedTime);
          color = PHASE_COLORS[phase.phase];
          phaseLabel = `${phase.phase.charAt(0).toUpperCase() + phase.phase.slice(1)}`;
        } else {
          color = PHASE_COLORS.passed;
          phaseLabel = 'Passed';
        }

        return (
          <CircleMarker
            key={light.id}
            center={[light.lat, light.lng]}
            radius={7}
            pathOptions={{
              color: isPassed ? PHASE_COLORS.passed : '#1f2937',
              fillColor: color,
              fillOpacity: isPassed ? 0.4 : 0.9,
              weight: 2,
            }}
          >
            <Popup>
              <div>
                <strong>Traffic Light #{index + 1}</strong>
                <br />
                <span style={{ color }}>{phaseLabel}</span>
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
