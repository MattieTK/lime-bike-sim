import type { SimulationStatus } from '../../types';
import styles from '../../styles/LimeBikeSimulator.module.css';

interface SimulationControlsProps {
  status: SimulationStatus;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  isReady: boolean;
  simulationSpeed: number;
  onSpeedChange?: (speed: number) => void;
}

export function SimulationControls({
  status,
  onPlay,
  onPause,
  onReset,
  isReady,
  simulationSpeed,
  onSpeedChange,
}: SimulationControlsProps) {
  const isPlaying = status === 'playing';
  const isFinished = status === 'finished';
  const isPaused = status === 'paused';

  return (
    <div className={styles.controls}>
      <div className={styles.controlButtons}>
        {/* Play/Pause button */}
        {!isFinished && (
          <button
            className={`${styles.controlButton} ${styles.primaryButton}`}
            onClick={isPlaying ? onPause : onPlay}
            disabled={!isReady}
          >
            {isPlaying ? (
              <>
                <PauseIcon /> Pause
              </>
            ) : (
              <>
                <PlayIcon /> {isPaused ? 'Resume' : 'Start Ride'}
              </>
            )}
          </button>
        )}

        {/* Reset button */}
        {(isPaused || isFinished) && (
          <button
            className={`${styles.controlButton} ${styles.secondaryButton}`}
            onClick={onReset}
          >
            <ResetIcon /> Reset
          </button>
        )}
      </div>

      {/* Speed control */}
      {onSpeedChange && (
        <div className={styles.speedControl}>
          <label className={styles.speedLabel}>
            Speed: {simulationSpeed}x
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={simulationSpeed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className={styles.speedSlider}
          />
        </div>
      )}

      {/* Status indicator */}
      <div className={styles.statusIndicator}>
        <span className={`${styles.statusDot} ${styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`]}`} />
        <span className={styles.statusText}>
          {status === 'idle' && 'Ready to start'}
          {status === 'loading' && 'Loading...'}
          {status === 'ready' && 'Ready'}
          {status === 'playing' && 'Riding...'}
          {status === 'paused' && 'Paused'}
          {status === 'finished' && 'Ride complete'}
        </span>
      </div>
    </div>
  );
}

// Icon components
function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
    </svg>
  );
}
