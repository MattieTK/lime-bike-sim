import type { CostBreakdown } from '../../types';
import { PRICING_MODELS } from '../../types';
import styles from '../../styles/LimeBikeSimulator.module.css';

interface AlternativePricingProps {
  costs: CostBreakdown;
  totalDistance: number;
}

function formatCurrency(amount: number): string {
  return `£${amount.toFixed(2)}`;
}

export function AlternativePricing({ costs, totalDistance }: AlternativePricingProps) {
  const distanceKm = totalDistance / 1000;

  return (
    <div className={styles.alternativePricing}>
      <div className={styles.altPricingTitle}>Pricing Model Comparison</div>

      <div className={styles.altPricingTable}>
        <div className={styles.altPricingRow}>
          <span className={styles.altPricingLabel}>
            Per-minute (current)
          </span>
          <span className={styles.altPricingValue}>
            {formatCurrency(costs.totalCost)}
          </span>
        </div>

        <div className={styles.altPricingRow}>
          <span className={styles.altPricingLabel}>
            Per-distance ({formatCurrency(PRICING_MODELS.PER_KM)}/km)
          </span>
          <span className={styles.altPricingValue}>
            {formatCurrency(costs.distanceBasedCost)}
          </span>
        </div>

        <div className={styles.altPricingRow}>
          <span className={styles.altPricingLabel}>
            Motion-only
          </span>
          <span className={styles.altPricingValue}>
            {formatCurrency(costs.motionOnlyCost)}
          </span>
        </div>
      </div>

      <div className={styles.altPricingDivider} />

      <div className={`${styles.altPricingRow} ${styles.altPricingHighlight}`}>
        <span className={styles.altPricingLabel}>Stop-time revenue</span>
        <span className={styles.altPricingValue}>
          {formatCurrency(costs.stopRevenue)}
        </span>
      </div>

      <div className={styles.altPricingNote}>
        Distance: {distanceKm.toFixed(2)} km
      </div>
    </div>
  );
}
