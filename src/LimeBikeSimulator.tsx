import { useState, useMemo } from 'react';
import type { LatLngBoundsExpression } from 'leaflet';
import type { LimeBikeSimulatorProps, Location } from './types';
import { useRoute } from './hooks/useRoute';
import { useTrafficLights } from './hooks/useTrafficLights';
import { useSimulation } from './hooks/useSimulation';
import { useCostCalculator } from './hooks/useCostCalculator';
import { MapView } from './components/Map/MapView';
import { RouteLayer } from './components/Map/RouteLayer';
import { BikeMarker } from './components/Map/BikeMarker';
import { TrafficLightMarkers } from './components/Map/TrafficLightMarkers';
import { CostDisplay } from './components/Display/CostDisplay';
import { RouteStats } from './components/Display/RouteStats';
import { SimulationControls } from './components/Controls/SimulationControls';
import { LocationPickerOverlay, LocationPickerUI } from './components/Controls/LocationPicker';
import styles from './styles/LimeBikeSimulator.module.css';

// Default values
const DEFAULT_UNLOCK_FEE = 1.0;
const DEFAULT_PER_MINUTE_RATE = 0.2;
const DEFAULT_SIMULATION_SPEED = 10;
const DEFAULT_MIN_WAIT_TIME = 15;
const DEFAULT_MAX_WAIT_TIME = 90;

type PickerMode = 'start' | 'end' | null;

export function LimeBikeSimulator({
  startLocation: propStartLocation,
  endLocation: propEndLocation,
  unlockFee = DEFAULT_UNLOCK_FEE,
  perMinuteRate = DEFAULT_PER_MINUTE_RATE,
  simulationSpeed: initialSimulationSpeed = DEFAULT_SIMULATION_SPEED,
  minWaitTime = DEFAULT_MIN_WAIT_TIME,
  maxWaitTime = DEFAULT_MAX_WAIT_TIME,
  width = '100%',
  height = 600,
  showControls = true,
  allowLocationPicker = true,
}: LimeBikeSimulatorProps) {
  // Local state for picked locations (when not provided via props)
  const [pickedStart, setPickedStart] = useState<Location | null>(null);
  const [pickedEnd, setPickedEnd] = useState<Location | null>(null);
  const [pickerMode, setPickerMode] = useState<PickerMode>(
    !propStartLocation ? 'start' : !propEndLocation ? 'end' : null
  );
  const [simulationSpeed, setSimulationSpeed] = useState(initialSimulationSpeed);

  // Use prop locations if provided, otherwise use picked locations
  const startLocation = propStartLocation || pickedStart || undefined;
  const endLocation = propEndLocation || pickedEnd || undefined;

  // Determine if location picker should be shown
  const showPicker = allowLocationPicker && (!propStartLocation || !propEndLocation);

  // Fetch route
  const {
    route,
    coordinates,
    cumulativeDistances,
    isLoading: routeLoading,
    error: routeError,
  } = useRoute(startLocation, endLocation);

  // Fetch traffic lights
  const {
    trafficLights,
    isLoading: lightsLoading,
    error: lightsError,
  } = useTrafficLights(coordinates);

  // Calculate total distance
  const totalDistance = route?.distance || 0;

  // Simulation
  const {
    state: simState,
    position,
    play,
    pause,
    reset,
    isReady,
  } = useSimulation({
    coordinates,
    cumulativeDistances,
    trafficLights,
    totalDistance,
    simulationSpeed,
    minWaitTime,
    maxWaitTime,
  });

  // Cost calculation
  const costs = useCostCalculator({
    state: simState,
    totalDistance,
    unlockFee,
    perMinuteRate,
  });

  // Calculate map bounds
  const bounds = useMemo((): LatLngBoundsExpression | undefined => {
    if (coordinates.length < 2) return undefined;

    let minLat = Infinity, maxLat = -Infinity;
    let minLng = Infinity, maxLng = -Infinity;

    for (const [lng, lat] of coordinates) {
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    }

    return [
      [minLat, minLng],
      [maxLat, maxLng],
    ];
  }, [coordinates]);

  // Loading state
  const isLoading = routeLoading || lightsLoading;
  const error = routeError || lightsError;

  // Container styles
  const containerStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  // Clear picked locations
  const handleClearLocations = () => {
    setPickedStart(null);
    setPickedEnd(null);
    setPickerMode('start');
  };

  return (
    <div className={styles.container} style={containerStyle}>
      {/* Map section - takes full container */}
      <div className={styles.mapSection}>
        <MapView bounds={bounds}>
          {/* Location picker overlay */}
          {showPicker && (
            <LocationPickerOverlay
              startLocation={pickedStart}
              endLocation={pickedEnd}
              onStartChange={setPickedStart}
              onEndChange={setPickedEnd}
              isEnabled={showPicker}
              pickerMode={pickerMode}
              onModeChange={setPickerMode}
            />
          )}

          {/* Route display */}
          <RouteLayer
            coordinates={coordinates}
            startLocation={startLocation}
            endLocation={endLocation}
          />

          {/* Traffic light markers */}
          <TrafficLightMarkers
            trafficLights={trafficLights}
            currentIndex={simState.currentTrafficLightIndex}
            isWaitingAtLight={simState.isWaitingAtLight}
          />

          {/* Bike marker */}
          <BikeMarker
            position={position}
            isWaiting={simState.isWaitingAtLight}
          />
        </MapView>

        {/* Location picker UI overlay - top left */}
        {showPicker && (
          <div className={styles.mapOverlay}>
            <LocationPickerUI
              startLocation={pickedStart}
              endLocation={pickedEnd}
              pickerMode={pickerMode}
              onModeChange={setPickerMode}
              onClear={handleClearLocations}
            />
          </div>
        )}

        {/* Info panel overlay - bottom right */}
        <div className={styles.infoPanel}>
          {/* Loading state */}
          {isLoading && (
            <div className={styles.loading}>
              <div className={styles.loadingSpinner} />
              <span>{routeLoading ? 'Finding route...' : 'Detecting traffic lights...'}</span>
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className={styles.error}>
              <div className={styles.errorTitle}>Error</div>
              <div className={styles.errorMessage}>{error}</div>
            </div>
          )}

          {/* Main content */}
          {!isLoading && !error && route && (
            <>
              {/* Controls first - most important */}
              {showControls && (
                <SimulationControls
                  status={simState.status}
                  onPlay={play}
                  onPause={pause}
                  onReset={reset}
                  isReady={isReady}
                  simulationSpeed={simulationSpeed}
                  onSpeedChange={setSimulationSpeed}
                />
              )}

              {/* Cost display */}
              <CostDisplay costs={costs} state={simState} />

              {/* Route stats */}
              <RouteStats
                state={simState}
                totalDistance={totalDistance}
                totalTrafficLights={trafficLights.length}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
