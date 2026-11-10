import { useState } from 'react';
import type { PricePlan, RoutePlan } from '../types';
import type { Forecast } from '../engine/forecast';
import type { Ride, RideContext } from '../engine/ride';
import {
  LIME,
  PRICES_CHECKED,
  alternatives,
  billedMinutes,
  formatMoney,
  formatPounds,
  limeFare,
  type Rates,
} from '../engine/pricing';
import { clock, distance as formatDistance, duration, plural } from '../format';
import styles from '../styles/LimeBikeSimulator.module.css';

interface Props {
  plan: RoutePlan;
  ctx: RideContext;
  ride: Ride;
  forecast: Forecast;
  pricePlan: PricePlan;
  rates: Rates;
}

/** The itemised bill for a finished ride, and what the lights added to it. */
export function Receipt({ plan, ctx, ride, forecast, pricePlan, rates }: Props) {
  const minutes = billedMinutes(ride.duration);
  const freeMinutes = billedMinutes(ctx.freeFlow.duration);
  const total = limeFare(pricePlan, ride.duration, rates);
  const ideal = limeFare(pricePlan, ctx.freeFlow.duration, rates);
  const extra = total - ideal;

  return (
    <section className={styles.receipt} data-component="receipt">
      <h3 className={styles.receiptTitle}>Ride receipt</h3>
      <dl className={styles.lines}>
        {pricePlan === 'payg' && (
          <>
            <Line label="Unlock" value={formatPounds(rates.unlockFee)} />
            <Line
              label={`${minutes} min × ${formatMoney(rates.perMinuteRate)}`}
              value={formatPounds(minutes * rates.perMinuteRate)}
            />
          </>
        )}
        {pricePlan === 'pass' && (
          <Line
            label={`${minutes} min from your LimePass`}
            value={formatPounds(total)}
            note={`${(LIME.pass.perMinute * 100).toFixed(1)}p a minute, no unlock fee`}
          />
        )}
        {pricePlan === 'prime' && (
          <Line
            label={minutes <= LIME.prime.shortMinutes ? 'LimePrime short ride' : 'LimePrime ride'}
            value={formatPounds(total)}
            note={
              minutes > LIME.prime.capMinutes
                ? `${minutes - LIME.prime.capMinutes} min over the 20-minute cap, charged here at the standard rate`
                : 'Flat fare, unlock included'
            }
          />
        )}
        <Line label="Total" value={formatPounds(total)} strong />
      </dl>

      <dl className={styles.lines}>
        <Line
          label={`Ride time ${clock(ride.duration)}`}
          value={`billed as ${minutes} min`}
          note="Lime rounds up to the next full minute"
        />
        <Line
          label="With every light green"
          value={`${clock(ctx.freeFlow.duration)} · ${formatPounds(ideal)}`}
        />
      </dl>

      <div className={styles.verdict} data-zero={extra < 0.005}>
        {extra >= 0.005 ? (
          <>
            <span>
              Red lights added <strong>{duration(ride.delay)}</strong> and cost you
            </span>
            <strong className={styles.verdictAmount}>{formatMoney(extra)}</strong>
            <span>{Math.round((extra / total) * 100)}% of the fare</span>
          </>
        ) : ride.delay >= 1 ? (
          <span>
            Red lights added <strong>{duration(ride.delay)}</strong>
            {pricePlan === 'prime'
              ? ', but a flat fare means they cost you nothing.'
              : `, but not enough to tip you into another billed minute (${freeMinutes} min either way).`}
          </span>
        ) : (
          <span>Green all the way. The lights cost you nothing this time.</span>
        )}
      </div>

      {ride.stops.length > 0 && (
        <>
          <h4 className={styles.subTitle}>
            Where you stopped · {plural(ride.stops.length, 'red light')}, {clock(ride.waiting)} standing still
          </h4>
          <ol className={styles.stops}>
            {ride.stops.map((stop) => {
              const sig = plan.signals[stop.signal];
              return (
                <li key={stop.signal}>
                  <span className={styles.stopDot} data-kind={sig.kind} aria-hidden="true" />
                  <span className={styles.stopName}>
                    {sig.name || (sig.kind === 'junction' ? 'Junction' : 'Crossing')}
                    <small>
                      {sig.kind === 'junction' ? 'traffic lights' : 'signalled crossing'} at{' '}
                      {formatDistance(sig.distance)}
                    </small>
                  </span>
                  <span className={styles.stopWait}>{clock(stop.wait)}</span>
                </li>
              );
            })}
          </ol>
        </>
      )}

      <Yearly forecast={forecast} />
      <Alternatives plan={plan} ctx={ctx} ride={ride} rates={rates} total={total} extra={extra} pricePlan={pricePlan} />
    </section>
  );
}

function Line({
  label,
  value,
  note,
  strong,
}: {
  label: string;
  value: string;
  note?: string;
  strong?: boolean;
}) {
  return (
    <div className={styles.line} data-strong={strong ? 'true' : 'false'}>
      <dt>
        {label}
        {note && <small>{note}</small>}
      </dt>
      <dd>{value}</dd>
    </div>
  );
}

/** Scales the average cost of the lights up to a year of regular rides. */
function Yearly({ forecast }: { forecast: Forecast }) {
  const [perWeek, setPerWeek] = useState(10);
  if (forecast.meanExtra < 0.005) return null;
  const yearly = forecast.meanExtra * perWeek * 52;
  const hours = (forecast.meanDelay * perWeek * 52) / 3600;
  return (
    <div className={styles.yearly} data-component="yearly">
      <div className={styles.stepper}>
        <span>Ride this route</span>
        <button
          type="button"
          aria-label="Fewer rides a week"
          onClick={() => setPerWeek((n) => Math.max(1, n - 1))}
          disabled={perWeek <= 1}
        >
          −
        </button>
        <output aria-label="Rides a week">{perWeek}</output>
        <button
          type="button"
          aria-label="More rides a week"
          onClick={() => setPerWeek((n) => Math.min(40, n + 1))}
          disabled={perWeek >= 40}
        >
          +
        </button>
        <span>{perWeek === 1 ? 'time' : 'times'} a week</span>
      </div>
      <p>
        and over a year red lights cost you about <strong>{formatPounds(yearly).replace(/\.\d+$/, '')}</strong>{' '}
        and <strong>{hours < 10 ? hours.toFixed(1) : Math.round(hours)} hours</strong> of waiting.
      </p>
    </div>
  );
}

function Alternatives({
  plan,
  ctx,
  ride,
  rates,
  total,
  extra,
  pricePlan,
}: Omit<Props, 'forecast'> & { total: number; extra: number }) {
  const rows = alternatives(rates)
    .filter((alt) => !(pricePlan === 'pass' && alt.id === 'lime-pass') && !(pricePlan === 'prime' && alt.id === 'lime-prime'))
    .map((alt) => {
      const fare = alt.fare(ride.duration, plan.distance);
      return { ...alt, fare, lights: fare - alt.fare(ctx.freeFlow.duration, plan.distance) };
    });
  return (
    <div data-component="alternatives">
      <h4 className={styles.subTitle}>The same trip, priced differently</h4>
      <table className={styles.alts}>
        <thead>
          <tr>
            <th scope="col">Hire bike</th>
            <th scope="col">Fare</th>
            <th scope="col">Of which red lights</th>
          </tr>
        </thead>
        <tbody>
          <tr data-current="true">
            <th scope="row">
              This ride
              <small>What you just paid</small>
            </th>
            <td>{formatPounds(total)}</td>
            <td>{extra >= 0.005 ? formatMoney(extra) : 'nothing'}</td>
          </tr>
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row">
                {row.name}
                <small>{row.basis}</small>
              </th>
              <td>{formatPounds(row.fare)}</td>
              <td>{row.lights >= 0.005 ? formatMoney(row.lights) : 'nothing'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.footnote}>
        Prices checked {PRICES_CHECKED}; they change often, so check the app. Passes and
        subscriptions have upfront costs that are not shown. Fares priced by distance or as a flat
        fee do not rise when a light turns red.
      </p>
    </div>
  );
}
