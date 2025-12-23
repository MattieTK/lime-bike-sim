import type { SimulationState } from '../../types';
import { BIKE_PHYSICS } from '../../types';
import styles from '../../styles/LimeBikeSimulator.module.css';

interface RouteStatsProps {
  state: SimulationState;
  totalDistance: number;
  totalTrafficLights: number;
}

function formatDistance(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(2)} km`;
  }
  return `${Math.round(meters)} m`;
}

function formatSpeed(metersPerSecond: number): string {
  const mph = metersPerSecond * 2.237; // Convert m/s to mph
  return `${mph.toFixed(1)} mph`;
}

export function RouteStats({ state, totalDistance, totalTrafficLights }: RouteStatsProps) {
  const { distanceTraveled, currentSpeed, routeProgress, currentTrafficLightIndex } = state;
  const remainingDistance = totalDistance - distanceTraveled;
  const remainingLights = totalTrafficLights - currentTrafficLightIndex;

  const progressPercent = Math.round(routeProgress * 100);

  return (
    <div className={styles.routeStats}>
      {/* Progress bar */}
      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className={styles.progressText}>{progressPercent}%</span>
      </div>

      {/* Distance stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statBox}>
          <span className={styles.statBoxLabel}>Distance</span>
          <span className={styles.statBoxValue}>{formatDistance(distanceTraveled)}</span>
          <span className={styles.statBoxSub}>of {formatDistance(totalDistance)}</span>
        </div>

        <div className={styles.statBox}>
          <span className={styles.statBoxLabel}>Speed</span>
          <span className={styles.statBoxValue}>{formatSpeed(currentSpeed)}</span>
          <span className={styles.statBoxSub}>max {BIKE_PHYSICS.MAX_SPEED_MPH} mph</span>
        </div>

        <div className={styles.statBox}>
          <span className={styles.statBoxLabel}>Remaining</span>
          <span className={styles.statBoxValue}>{formatDistance(remainingDistance)}</span>
          <span className={styles.statBoxSub}>{remainingLights} lights ahead</span>
        </div>
      </div>
    </div>
  );
}
