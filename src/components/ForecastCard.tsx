import { useMemo, useState } from 'react';
import type { Forecast } from '../engine/forecast';
import { histogram, luckPercentile } from '../engine/forecast';
import { formatMoney } from '../engine/pricing';
import { clock, duration } from '../format';
import styles from '../styles/LimeBikeSimulator.module.css';

interface Props {
  forecast: Forecast;
  /** Seconds this ride lost to lights, once it has finished. */
  yourDelay: number | null;
  signalCount: number;
}

const W = 320;
const H = 96;
const AXIS = 18;

/** What red lights cost on this route across hundreds of simulated departures. */
export function ForecastCard({ forecast, yourDelay, signalCount }: Props) {
  const { binSeconds, counts } = useMemo(() => histogram(forecast), [forecast]);
  const [hover, setHover] = useState<number | null>(null);

  if (signalCount === 0) {
    return (
      <section className={styles.card} data-component="forecast">
        <h3 className={styles.cardTitle}>No traffic lights on this route</h3>
        <p className={styles.cardText}>
          Nothing here will stop the meter running, so you pay for riding time only:{' '}
          <strong>{formatMoney(forecast.freeFlowFare)}</strong> for {duration(forecast.freeFlow)}.
        </p>
      </section>
    );
  }

  const span = counts.length * binSeconds;
  const peak = Math.max(...counts);
  const barW = W / counts.length;
  const x = (seconds: number) => (Math.min(seconds, span) / span) * W;
  const share = forecast.meanDelay / forecast.meanDuration;
  const luck = yourDelay == null ? null : luckPercentile(forecast, yourDelay);
  // A few round-number ticks along the bottom.
  const tickEvery = [30, 60, 120, 180, 300, 600].find((t) => span / t <= 5) ?? 600;
  const ticks: number[] = [];
  for (let t = 0; t <= span; t += tickEvery) ticks.push(t);

  return (
    <section className={styles.card} data-component="forecast">
      <h3 className={styles.cardTitle}>What red lights cost on this route</h3>
      <div className={styles.heroRow}>
        <div>
          <div className={styles.hero}>{formatMoney(forecast.meanExtra)}</div>
          <div className={styles.heroLabel}>added to an average ride</div>
        </div>
        <div>
          <div className={styles.hero}>{duration(forecast.meanDelay)}</div>
          <div className={styles.heroLabel}>
            lost to lights, {Math.round(share * 100)}% of the ride
          </div>
        </div>
      </div>

      <figure className={styles.chart}>
        <svg
          viewBox={`0 0 ${W} ${H + AXIS}`}
          role="img"
          aria-label={`Time lost to red lights across ${forecast.rides} simulated rides. Typical: ${duration(forecast.medianDelay)}. Nine in ten rides fall between ${duration(forecast.lowDelay)} and ${duration(forecast.highDelay)}.`}
          onMouseLeave={() => setHover(null)}
        >
          {counts.map((count, i) => {
            const h = peak ? (count / peak) * (H - 14) : 0;
            return (
              <g key={i} onMouseEnter={() => setHover(i)}>
                {/* Full-height hit area so thin bars are easy to hover. */}
                <rect x={i * barW} y={0} width={barW} height={H} fill="transparent" />
                {count > 0 && (
                  <path
                    className={styles.bar}
                    data-hover={hover === i}
                    d={roundedBar(i * barW + 1, H - h, barW - 2, h, 3)}
                  />
                )}
              </g>
            );
          })}
          <line className={styles.axis} x1={0} x2={W} y1={H} y2={H} />
          {ticks.map((t) => (
            <text
              key={t}
              className={styles.tick}
              x={x(t)}
              y={H + 13}
              textAnchor={t === 0 ? 'start' : x(t) > W - 12 ? 'end' : 'middle'}
            >
              {t === 0 ? '0' : clock(t)}
            </text>
          ))}
          {yourDelay != null && (
            <g className={styles.you}>
              <line x1={x(yourDelay)} x2={x(yourDelay)} y1={10} y2={H} />
              <circle cx={x(yourDelay)} cy={10} r={4} />
              <text
                x={x(yourDelay)}
                y={7}
                dx={x(yourDelay) > W / 2 ? -8 : 8}
                dy={6}
                textAnchor={x(yourDelay) > W / 2 ? 'end' : 'start'}
              >
                Your ride
              </text>
            </g>
          )}
        </svg>
        <figcaption className={styles.chartCaption}>
          {hover != null ? (
            <>
              <strong>{counts[hover]}</strong> of {forecast.rides} rides lost {clock(hover * binSeconds)}–
              {clock((hover + 1) * binSeconds)}
            </>
          ) : (
            <>
              Minutes lost to lights across {forecast.rides} simulated departures. Nine in ten fall
              between {clock(forecast.lowDelay)} and {clock(forecast.highDelay)}.
            </>
          )}
        </figcaption>
      </figure>

      {luck != null && (
        <p className={styles.cardText}>
          {luck >= 0.5 ? (
            <>
              The lights were against you: this ride lost more time than{' '}
              <strong>{Math.round(luck * 100)}%</strong> of rides on this route.
            </>
          ) : (
            <>
              You got lucky: <strong>{Math.round((1 - luck) * 100)}%</strong> of rides on this route
              lose more time to lights than this one did.
            </>
          )}
        </p>
      )}
    </section>
  );
}

/** A bar with rounded top corners, anchored flat to the baseline. */
function roundedBar(x: number, y: number, w: number, h: number, r: number): string {
  const rr = Math.min(r, w / 2, h);
  return `M${x},${y + h}V${y + rr}Q${x},${y} ${x + rr},${y}H${x + w - rr}Q${x + w},${y} ${x + w},${y + rr}V${y + h}Z`;
}
