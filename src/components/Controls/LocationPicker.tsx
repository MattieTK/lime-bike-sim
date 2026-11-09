import { useMapEvents, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Location } from '../../types';
import styles from '../../styles/LimeBikeSimulator.module.css';

interface LocationPickerProps {
  startLocation: Location | null;
  endLocation: Location | null;
  onStartChange: (location: Location) => void;
  onEndChange: (location: Location) => void;
  isEnabled: boolean;
}

type PickerMode = 'start' | 'end' | null;

interface MapClickHandlerProps {
  mode: PickerMode;
  onStartChange: (location: Location) => void;
  onEndChange: (location: Location) => void;
}

function MapClickHandler({ mode, onStartChange, onEndChange }: MapClickHandlerProps) {
  useMapEvents({
    click: (e) => {
      if (!mode) return;

      const location: Location = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      };

      if (mode === 'start') {
        onStartChange(location);
      } else {
        onEndChange(location);
      }
    },
  });

  return null;
}

// Temporary marker icons for picker
const pickerStartIcon = L.divIcon({
  className: 'picker-marker',
  html: `<div style="
    background: #22c55e;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    opacity: 0.8;
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const pickerEndIcon = L.divIcon({
  className: 'picker-marker',
  html: `<div style="
    background: #ef4444;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    opacity: 0.8;
  "></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export function LocationPickerOverlay({
  startLocation,
  endLocation,
  onStartChange,
  onEndChange,
  isEnabled,
  pickerMode,
  onModeChange,
}: LocationPickerProps & {
  pickerMode: PickerMode;
  onModeChange: (mode: PickerMode) => void;
}) {
  if (!isEnabled) return null;

  return (
    <>
      <MapClickHandler
        mode={pickerMode}
        onStartChange={(loc) => {
          onStartChange(loc);
          if (!endLocation) {
            onModeChange('end');
          } else {
            onModeChange(null);
          }
        }}
        onEndChange={(loc) => {
          onEndChange(loc);
          onModeChange(null);
        }}
      />

      {/* Show temporary markers for picked locations */}
      {startLocation && (
        <Marker position={[startLocation.lat, startLocation.lng]} icon={pickerStartIcon}>
          <Popup>Start location</Popup>
        </Marker>
      )}
      {endLocation && (
        <Marker position={[endLocation.lat, endLocation.lng]} icon={pickerEndIcon}>
          <Popup>End location</Popup>
        </Marker>
      )}
    </>
  );
}

export function LocationPickerUI({
  startLocation,
  endLocation,
  pickerMode,
  onModeChange,
  onClear,
}: {
  startLocation: Location | null;
  endLocation: Location | null;
  pickerMode: PickerMode;
  onModeChange: (mode: PickerMode) => void;
  onClear: () => void;
}) {
  const hasLocations = startLocation || endLocation;
  const isComplete = startLocation && endLocation;

  return (
    <div className={styles.locationPicker} data-component="location-picker">
      <div className={styles.pickerTitle}>Set Route</div>

      <div className={styles.pickerButtons}>
        <button
          className={`${styles.pickerButton} ${pickerMode === 'start' ? styles.pickerActive : ''} ${startLocation ? styles.pickerSet : ''}`}
          onClick={() => onModeChange(pickerMode === 'start' ? null : 'start')}
          data-action="set-location"
          data-location="start"
          data-active={pickerMode === 'start'}
          data-set={!!startLocation}
        >
          <span className={styles.pickerDot} style={{ background: '#22c55e' }} />
          {startLocation ? 'Start set' : 'Set start'}
        </button>

        <button
          className={`${styles.pickerButton} ${pickerMode === 'end' ? styles.pickerActive : ''} ${endLocation ? styles.pickerSet : ''}`}
          onClick={() => onModeChange(pickerMode === 'end' ? null : 'end')}
          data-action="set-location"
          data-location="end"
          data-active={pickerMode === 'end'}
          data-set={!!endLocation}
        >
          <span className={styles.pickerDot} style={{ background: '#ef4444' }} />
          {endLocation ? 'End set' : 'Set end'}
        </button>
      </div>

      {pickerMode && (
        <div className={styles.pickerHint}>
          Click on the map to set {pickerMode} location
        </div>
      )}

      {hasLocations && !isComplete && (
        <div className={styles.pickerHint}>
          {!startLocation && 'Click to set start location'}
          {!endLocation && startLocation && 'Now click to set end location'}
        </div>
      )}

      {hasLocations && (
        <button
          className={styles.clearButton}
          onClick={onClear}
          data-action="clear-locations"
        >
          Clear locations
        </button>
      )}
    </div>
  );
}
