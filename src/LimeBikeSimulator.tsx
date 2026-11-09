import { useState, useMemo, useRef, useEffect } from 'react';
import type { LatLngBoundsExpression } from 'leaflet';
import type { LimeBikeSimulatorProps, Location, TrafficLight } from './types';
import { generateTrafficLightTiming } from './types';
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
import { AlternativePricing } from './components/Display/AlternativePricing';
import { ShareButtons } from './components/Display/ShareButtons';
import { CollapsibleSection } from './components/Display/CollapsibleSection';
import { SimulationControls } from './components/Controls/SimulationControls';
import { LocationPickerOverlay, LocationPickerUI } from './components/Controls/LocationPicker';
import styles from './styles/LimeBikeSimulator.module.css';

// Default values
const DEFAULT_UNLOCK_FEE = 1.0;
const DEFAULT_PER_MINUTE_RATE = 0.2;
const DEFAULT_SIMULATION_SPEED = 10;

type PickerMode = 'start' | 'end' | null;

export function LimeBikeSimulator({
  startLocation: propStartLocation,
  endLocation: propEndLocation,
  precomputedRoute,
  unlockFee = DEFAULT_UNLOCK_FEE,
  perMinuteRate = DEFAULT_PER_MINUTE_RATE,
  simulationSpeed: initialSimulationSpeed = DEFAULT_SIMULATION_SPEED,
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
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const prevStatusRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Listen for fullscreen changes (user can exit with Escape key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Use prop locations if provided, otherwise use picked locations
  const startLocation = propStartLocation || pickedStart || undefined;
  const endLocation = propEndLocation || pickedEnd || undefined;

  // Determine if location picker should be shown
  const showPicker = allowLocationPicker && (!propStartLocation || !propEndLocation) && !precomputedRoute;

  // Fetch route (skip if precomputed)
  const {
    route: fetchedRoute,
    coordinates: fetchedCoordinates,
    cumulativeDistances: fetchedCumulativeDistances,
    isLoading: routeLoading,
    error: routeError,
  } = useRoute(
    precomputedRoute ? undefined : startLocation,
    precomputedRoute ? undefined : endLocation
  );

  // Fetch traffic lights (skip if precomputed)
  const {
    trafficLights: fetchedTrafficLights,
    isLoading: lightsLoading,
    error: lightsError,
  } = useTrafficLights(precomputedRoute ? [] : fetchedCoordinates);

  // Use precomputed data or fetched data
  const coordinates = precomputedRoute?.coordinates ?? fetchedCoordinates;
  const totalDistance = precomputedRoute?.distance ?? fetchedRoute?.distance ?? 0;

  // Calculate cumulative distances for precomputed route
  const cumulativeDistances = useMemo(() => {
    if (precomputedRoute) {
      // Calculate from coordinates
      const distances: number[] = [0];
      let total = 0;
      for (let i = 1; i < precomputedRoute.coordinates.length; i++) {
        const [lng1, lat1] = precomputedRoute.coordinates[i - 1];
        const [lng2, lat2] = precomputedRoute.coordinates[i];
        // Haversine distance
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        total += R * c;
        distances.push(total);
      }
      return distances;
    }
    return fetchedCumulativeDistances;
  }, [precomputedRoute, fetchedCumulativeDistances]);

  // Store generated timing in a ref to keep it stable across renders
  const generatedTimingRef = useRef<Map<number, ReturnType<typeof generateTrafficLightTiming>>>(new Map());

  // Convert precomputed traffic lights to full TrafficLight objects (add timing)
  const trafficLights: TrafficLight[] = useMemo(() => {
    if (precomputedRoute) {
      return precomputedRoute.trafficLights.map((light, index) => {
        // Reuse existing timing or generate new one
        if (!generatedTimingRef.current.has(light.id)) {
          generatedTimingRef.current.set(light.id, generateTrafficLightTiming());
        }
        return {
          ...light,
          routeIndex: index,
          timing: generatedTimingRef.current.get(light.id)!,
        };
      });
    }
    return fetchedTrafficLights;
  }, [precomputedRoute, fetchedTrafficLights]);

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
  });

  // Auto-expand Cost section when ride finishes
  useEffect(() => {
    if (simState.status === 'finished' && prevStatusRef.current !== 'finished') {
      setOpenSection('cost');
    }
    prevStatusRef.current = simState.status;
  }, [simState.status]);

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

  // Loading state (skip if precomputed)
  const isLoading = precomputedRoute ? false : (routeLoading || lightsLoading);
  const error = precomputedRoute ? null : (routeError || lightsError);
  const hasRoute = precomputedRoute ? true : !!fetchedRoute;

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
    <div
      ref={containerRef}
      className={`${styles.container} ${isFullscreen ? styles.fullscreen : ''}`}
      style={containerStyle}
      data-component="lime-simulator"
    >
      {/* Map section - takes full container */}
      <div className={styles.mapSection}>
        <MapView
          bounds={bounds}
          followPosition={position}
          isFollowing={simState.status === 'playing' || simState.status === 'paused'}
        >
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
            elapsedTime={simState.elapsedTime}
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

        {/* Bottom left controls - reset and fullscreen */}
        <div className={styles.mapOverlayBottomLeft}>
          {(simState.status === 'playing' || simState.status === 'paused' || simState.status === 'finished') && (
            <button
              className={styles.resetButtonFloat}
              onClick={reset}
              title="Reset ride"
              aria-label="Reset ride"
              data-action="reset"
              data-location="map-overlay"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
              </svg>
            </button>
          )}
          <button
            className={styles.fullscreenButtonFloat}
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            data-action="toggle-fullscreen"
            data-fullscreen={isFullscreen}
          >
            {isFullscreen ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            )}
          </button>
        </div>

        {/* Info panel overlay - bottom right */}
        <div className={styles.infoPanel} data-status={simState.status}>
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
          {!isLoading && !error && hasRoute && (
            <>
              {/* Controls - hide speed/progress when finished */}
              {showControls && (
                <SimulationControls
                  status={simState.status}
                  onPlay={play}
                  onPause={pause}
                  onReset={reset}
                  isReady={isReady}
                  simulationSpeed={simulationSpeed}
                  onSpeedChange={simState.status !== 'finished' ? setSimulationSpeed : undefined}
                  hideProgress={simState.status === 'finished'}
                />
              )}

              {/* Cost display - collapsible on mobile */}
              <CollapsibleSection
                title="Cost"
                defaultCollapsed={true}
                highlight={`£${costs.totalCost.toFixed(2)}`}
                sectionId="cost"
                openSectionId={openSection}
                onOpen={setOpenSection}
              >
                <CostDisplay costs={costs} state={simState} perMinuteRate={perMinuteRate} />
              </CollapsibleSection>

              {/* Route stats - hide when finished */}
              {simState.status !== 'finished' && (
                <CollapsibleSection
                  title="Progress"
                  defaultCollapsed={true}
                  highlight={`${Math.round(simState.routeProgress * 100)}%`}
                  sectionId="progress"
                  openSectionId={openSection}
                  onOpen={setOpenSection}
                >
                  <RouteStats
                    state={simState}
                    totalDistance={totalDistance}
                    totalTrafficLights={trafficLights.length}
                  />
                </CollapsibleSection>
              )}

              {/* Alternative pricing comparison - show when finished */}
              {simState.status === 'finished' && (
                <CollapsibleSection
                  title="Pricing Comparison"
                  defaultCollapsed={false}
                  sectionId="pricing"
                  openSectionId={openSection}
                  onOpen={setOpenSection}
                >
                  <AlternativePricing costs={costs} totalDistance={totalDistance} />
                </CollapsibleSection>
              )}

              {/* Share buttons - show when finished, but not for preconfigured routes */}
              {simState.status === 'finished' && !precomputedRoute && (
                <CollapsibleSection
                  title="Share"
                  defaultCollapsed={false}
                  sectionId="share"
                  openSectionId={openSection}
                  onOpen={setOpenSection}
                >
                  <ShareButtons
                    totalDistance={totalDistance}
                    stopCount={simState.lightsEncountered}
                    stopTime={simState.totalWaitTime}
                    stopRevenue={costs.stopRevenue}
                  />
                </CollapsibleSection>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
