import type { Pace, PricePlan, RoutePlan, Traffic } from '../types';
import { PACE_PROFILES } from '../types';
import { PLAN_LABELS, PRICES_CHECKED, formatMoney, formatPounds, type Rates } from '../engine/pricing';
import styles from '../styles/LimeBikeSimulator.module.css';

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string; hint?: string }[];
  onChange: (value: T) => void;
}

export function Segmented<T extends string>({ label, value, options, onChange }: SegmentedProps<T>) {
  return (
    <div className={styles.setting}>
      <span className={styles.settingLabel}>{label}</span>
      <div className={styles.segmented} role="radiogroup" aria-label={label}>
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={opt.value === value}
            title={opt.hint}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface Props {
  pace: Pace;
  traffic: Traffic;
  pricePlan: PricePlan;
  rates: Rates;
  plan: RoutePlan;
  onPace: (pace: Pace) => void;
  onTraffic: (traffic: Traffic) => void;
  onPricePlan: (plan: PricePlan) => void;
}

/** The knobs behind the model, and a plain account of what it does and does not know. */
export function Assumptions({ pace, traffic, pricePlan, rates, plan, onPace, onTraffic, onPricePlan }: Props) {
  const rider = PACE_PROFILES[pace];
  return (
    <details className={styles.assumptions} data-component="assumptions">
      <summary>
        <span>Assumptions</span>
        <small>
          {rider.label} rider · {traffic === 'rush' ? 'rush hour' : `${traffic} traffic`} ·{' '}
          {PLAN_LABELS[pricePlan].name}
        </small>
      </summary>

      <Segmented
        label="Rider"
        value={pace}
        onChange={onPace}
        options={(Object.keys(PACE_PROFILES) as Pace[]).map((p) => ({
          value: p,
          label: PACE_PROFILES[p].label,
          hint: `Cruises at ${Math.round(PACE_PROFILES[p].cruise * 3.6)} km/h`,
        }))}
      />
      <Segmented
        label="Streets"
        value={traffic}
        onChange={onTraffic}
        options={[
          { value: 'quiet', label: 'Quiet', hint: 'Short signal cycles, few people crossing' },
          { value: 'typical', label: 'Typical' },
          { value: 'rush', label: 'Rush hour', hint: 'Long signal cycles, busy crossings' },
        ]}
      />
      <Segmented
        label="Paying with"
        value={pricePlan}
        onChange={onPricePlan}
        options={(Object.keys(PLAN_LABELS) as PricePlan[]).map((p) => ({
          value: p,
          label: p === 'payg' ? 'Pay as you go' : PLAN_LABELS[p].name,
          hint: PLAN_LABELS[p].detail,
        }))}
      />

      <div className={styles.method}>
        <p>
          <strong>Fare.</strong>{' '}
          {pricePlan === 'payg'
            ? `${formatPounds(rates.unlockFee)} to unlock, then ${formatMoney(rates.perMinuteRate)} for every started minute.`
            : `${PLAN_LABELS[pricePlan].detail}.`}{' '}
          Lime rounds ride time up to the next full minute. Prices checked {PRICES_CHECKED}.
        </p>
        <p>
          <strong>Rider.</strong> Cruises at {Math.round(rider.cruise * 3.6)} km/h (the motor stops
          helping at 25 km/h), slows for corners, pushes the bike where the route says to dismount,
          and stops for every red light.
        </p>
        <p>
          <strong>Lights.</strong>{' '}
          {plan.signalSource === 'precomputed'
            ? 'Positions were supplied with this route.'
            : 'Positions come from OpenStreetMap.'}{' '}
          London does not publish signal timings, so each light gets a realistic fixed cycle:
          junctions run {traffic === 'quiet' ? '56–80' : traffic === 'rush' ? '80–120' : '64–96'}{' '}
          seconds with 30–55% green for your approach; signalled crossings stay green until someone
          presses the button. The time lost is measured against the same ride with every light
          green, so it includes braking and pulling away, not just standing still.
        </p>
        <p>
          <strong>Not modelled.</strong> Queues of traffic, hills, zebra crossings, give-way
          junctions, linked signals that give a run of greens, and riders who jump reds.
        </p>
      </div>
    </details>
  );
}
