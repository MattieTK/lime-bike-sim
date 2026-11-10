import { useRef } from 'react';
import type { RoutePlan } from '../types';
import type { Ride } from '../engine/ride';
import { phaseAt, type SignalPlan } from '../engine/signalModel';
import { clock } from '../format';
import styles from '../styles/LimeBikeSimulator.module.css';

interface Props {
  plan: RoutePlan;
  ride: Ride;
  signalPlans: SignalPlan[];
  time: number;
  distance: number;
  onSeek: (distance: number) => void;
}

/**
 * The route laid out as a straight line: every set of lights in its live
 * colour, the rider's position, and a mark wherever a red made them stop.
 * Click or drag to jump to any point of the ride.
 */
export function RouteStrip({ plan, ride, signalPlans, time, distance, onSeek }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const pct = (metres: number) => `${(metres / plan.distance) * 100}%`;

  const seekFromEvent = (clientX: number) => {
    const box = track.current?.getBoundingClientRect();
    if (!box || box.width === 0) return;
    onSeek(Math.max(0, Math.min(1, (clientX - box.left) / box.width)) * plan.distance);
  };

  return (
    <div className={styles.strip} data-component="route-strip">
      <div
        ref={track}
        className={styles.stripTrack}
        role="slider"
        tabIndex={0}
        aria-label="Position along the route"
        aria-valuemin={0}
        aria-valuemax={Math.round(plan.distance)}
        aria-valuenow={Math.round(distance)}
        aria-valuetext={`${Math.round((distance / plan.distance) * 100)}% of the way`}
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          seekFromEvent(e.clientX);
        }}
        onPointerMove={(e) => dragging.current && seekFromEvent(e.clientX)}
        onPointerUp={() => (dragging.current = false)}
        onPointerCancel={() => (dragging.current = false)}
        onKeyDown={(e) => {
          const step = plan.distance / 40;
          if (e.key === 'ArrowRight') onSeek(Math.min(plan.distance, distance + step));
          else if (e.key === 'ArrowLeft') onSeek(Math.max(0, distance - step));
          else return;
          e.preventDefault();
        }}
      >
        <div className={styles.stripLine} />
        {plan.steps
          .filter((s) => s.walk && s.to - s.from > 15)
          .map((s) => (
            <div
              key={s.from}
              className={styles.stripWalk}
              style={{ left: pct(s.from), width: pct(s.to - s.from) }}
              title="Dismount and push"
            />
          ))}
        <div className={styles.stripDone} style={{ width: pct(distance) }} />
        {plan.signals.map((sig, i) => {
          const passed = distance > sig.distance + 2;
          const stop = ride.stops.find((s) => s.signal === i && s.at <= time);
          return (
            <div
              key={sig.id + ':' + i}
              className={styles.stripLight}
              data-kind={sig.kind}
              data-phase={passed ? 'passed' : phaseAt(signalPlans[i], time, ride.offsets[i])}
              data-stopped={stop ? 'true' : 'false'}
              style={{ left: pct(sig.distance) }}
              title={
                stop
                  ? `Stopped ${clock(stop.wait)}${sig.name ? ` on ${sig.name}` : ''}`
                  : sig.name || undefined
              }
            />
          );
        })}
        <div className={styles.stripRider} style={{ left: pct(distance) }} />
      </div>
    </div>
  );
}
