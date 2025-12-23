import type { CostBreakdown, SimulationState } from '../../types';
import styles from '../../styles/LimeBikeSimulator.module.css';

interface CostDisplayProps {
  costs: CostBreakdown;
  state: SimulationState;
}

function formatCurrency(amount: number): string {
  return `£${amount.toFixed(2)}`;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function CostDisplay({ costs, state }: CostDisplayProps) {
  const { status, elapsedTime, totalWaitTime, currentWaitTime, isWaitingAtLight, lightsEncountered } = state;
  const effectiveWaitTime = totalWaitTime + (isWaitingAtLight ? currentWaitTime : 0);

  const isFinished = status === 'finished';

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
          <span className={styles.costRowLabel}>Ideal ride (no stops):</span>
          <span className={styles.costRowValue}>{formatCurrency(costs.idealCost)}</span>
        </div>
        <div className={`${styles.costRow} ${styles.costWasted}`}>
          <span className={styles.costRowLabel}>Money wasted waiting:</span>
          <span className={styles.costRowValue}>{formatCurrency(costs.wastedMoney)}</span>
        </div>
      </div>

      {/* Time stats */}
      <div className={styles.timeStats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Ride time</span>
          <span className={styles.statValue}>{formatTime(elapsedTime)}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Time waiting</span>
          <span className={`${styles.statValue} ${styles.statWaiting}`}>
            {formatTime(effectiveWaitTime)}
          </span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Traffic lights</span>
          <span className={styles.statValue}>{lightsEncountered}</span>
        </div>
      </div>

      {/* Waiting indicator */}
      {isWaitingAtLight && (
        <div className={styles.waitingIndicator}>
          <div className={styles.waitingDot} />
          <span>Waiting at traffic light... ({Math.floor(currentWaitTime)}s)</span>
        </div>
      )}

      {/* Finished summary */}
      {isFinished && (
        <div className={styles.finishedSummary}>
          <div className={styles.summaryTitle}>Ride Complete!</div>
          <div className={styles.summaryText}>
            You spent <strong>{formatTime(effectiveWaitTime)}</strong> waiting at {lightsEncountered} traffic light{lightsEncountered !== 1 ? 's' : ''},
            costing you an extra <strong>{formatCurrency(costs.wastedMoney)}</strong>.
          </div>
        </div>
      )}
    </div>
  );
}
