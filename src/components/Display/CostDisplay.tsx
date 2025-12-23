import type { CostBreakdown, SimulationState } from '../../types';
import styles from '../../styles/LimeBikeSimulator.module.css';

interface CostDisplayProps {
  costs: CostBreakdown;
  state: SimulationState;
  perMinuteRate: number;
}

function formatCurrency(amount: number): string {
  return `£${amount.toFixed(2)}`;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function CostDisplay({ costs, state, perMinuteRate }: CostDisplayProps) {
  const { status, elapsedTime, totalWaitTime, currentWaitTime, isWaitingAtLight, lightsEncountered } = state;
  const effectiveWaitTime = totalWaitTime + (isWaitingAtLight ? currentWaitTime : 0);

  const isFinished = status === 'finished';

  // Calculate live revenue being generated while stopped
  const liveStopRevenue = (currentWaitTime / 60) * perMinuteRate;

  return (
    <div className={styles.costDisplay}>
      {/* Main cost */}
      <div className={styles.costMain}>
        <div className={styles.costLabel}>Current Cost</div>
        <div className={styles.costValue}>{formatCurrency(costs.totalCost)}</div>
      </div>

      {/* Comparison */}
      <div className={styles.costComparison}>
        <div className={styles.costRow}>
          <span className={styles.costRowLabel}>Uninterrupted ride:</span>
          <span className={styles.costRowValue}>{formatCurrency(costs.idealCost)}</span>
        </div>
        <div className={`${styles.costRow} ${styles.stopRevenue}`}>
          <span className={styles.costRowLabel}>Stop-time revenue:</span>
          <span className={styles.costRowValue}>{formatCurrency(costs.stopRevenue)}</span>
        </div>
      </div>

      {/* Time stats */}
      <div className={styles.timeStats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Ride time</span>
          <span className={styles.statValue}>{formatTime(elapsedTime)}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Time stopped</span>
          <span className={`${styles.statValue} ${styles.statWaiting}`}>
            {formatTime(effectiveWaitTime)}
          </span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Traffic lights</span>
          <span className={styles.statValue}>{lightsEncountered}</span>
        </div>
      </div>

      {/* Live revenue counter while stopped */}
      {isWaitingAtLight && (
        <div className={styles.waitingIndicator}>
          <div className={styles.waitingDot} />
          <span>Stopped at light</span>
          <span className={styles.liveRevenue}>+{formatCurrency(liveStopRevenue)}</span>
        </div>
      )}

      {/* Finished summary */}
      {isFinished && (
        <div className={styles.finishedSummary}>
          <div className={styles.summaryTitle}>Ride Complete</div>
          <div className={styles.summaryText}>
            Stopped at <strong>{lightsEncountered}</strong> traffic light{lightsEncountered !== 1 ? 's' : ''} for <strong>{formatTime(effectiveWaitTime)}</strong>.
            Stop-time revenue: <strong>{formatCurrency(costs.stopRevenue)}</strong>.
          </div>
        </div>
      )}
    </div>
  );
}
