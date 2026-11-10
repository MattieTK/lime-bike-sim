import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LimeBikeSimulatorProps, Location, Pace, PricePlan, Traffic } from './types';
import { runForecast } from './engine/forecast';
import { LIME, formatMoney, formatPounds, limeFare } from './engine/pricing';
import { createContext, sampleAt, signalPlans, simulateRide, timeAtDistance } from './engine/ride';
import { randomSeed } from './engine/rng';
import { streetAt } from './engine/routing';
import { usePlan } from './hooks/usePlan';
import { usePlayback } from './hooks/usePlayback';
import { nameOf } from './services/places';
import { MapCanvas, type MapHandle } from './components/MapCanvas';
import { PlacePicker } from './components/PlacePicker';
import { RouteStrip } from './components/RouteStrip';
import { ForecastCard } from './components/ForecastCard';
import { Receipt } from './components/Receipt';
import { Assumptions } from './components/Assumptions';
import { ShareRow } from './components/ShareRow';
import { clock, distance as formatDistance, duration, plural } from './format';
import styles from './styles/LimeBikeSimulator.module.css';

const SPEEDS = [1, 10, 30, 100];

/** Reads "#ride=lat,lng;lat,lng;seed" so a shared link reopens the same ride. */
function readHash(): { start: Location; end: Location; seed?: number } | null {
  if (typeof window === 'undefined') return null;
  const match = /ride=([-\d.]+),([-\d.]+);([-\d.]+),([-\d.]+)(?:;(\d+))?/.exec(window.location.hash);
  if (!match) return null;
  const [a, b, c, d] = match.slice(1, 5).map(Number);
  if (![a, b, c, d].every(Number.isFinite)) return null;
  return {
    start: { lat: a, lng: b },
    end: { lat: c, lng: d },
    seed: match[5] ? Number(match[5]) : undefined,
  };
}

function useDark(theme: 'auto' | 'light' | 'dark'): boolean {
  const [systemDark, setSystemDark] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setSystemDark(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return theme === 'auto' ? systemDark : theme === 'dark';
}

export function LimeBikeSimulator({
  startLocation,
  endLocation,
  precomputedRoute,
  unlockFee = LIME.unlock,
  perMinuteRate = LIME.perMinute,
  simulationSpeed = 30,
  width = '100%',
  height = 600,
  showControls = true,
  allowLocationPicker = true,
  theme = 'auto',
  pace: initialPace = 'typical',
  traffic: initialTraffic = 'typical',
  seed: initialSeed,
  syncUrl = true,
  tileUrl,
  tileAttribution,
}: LimeBikeSimulatorProps) {
  const canPick = allowLocationPicker && !precomputedRoute && !(startLocation && endLocation);
  const shared = useMemo(() => (canPick && syncUrl ? readHash() : null), [canPick, syncUrl]);

  const [pickedStart, setPickedStart] = useState<Location | null>(shared?.start ?? null);
  const [pickedEnd, setPickedEnd] = useState<Location | null>(shared?.end ?? null);
  const [picking, setPicking] = useState<'start' | 'end' | null>(
    shared ? null : startLocation ? 'end' : 'start'
  );
  const [pace, setPace] = useState<Pace>(initialPace);
  const [traffic, setTraffic] = useState<Traffic>(initialTraffic);
  const [pricePlan, setPricePlan] = useState<PricePlan>('payg');
  const [speed, setSpeed] = useState(simulationSpeed);
  const [seed, setSeed] = useState(() => initialSeed ?? shared?.seed ?? randomSeed());
  const [following, setFollowing] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  const root = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapHandle>(null);
  const autoplay = useRef(false);
  const dark = useDark(theme);

  const start = startLocation ?? pickedStart ?? undefined;
  const end = endLocation ?? pickedEnd ?? undefined;
  const rates = useMemo(() => ({ unlockFee, perMinuteRate }), [unlockFee, perMinuteRate]);

  const { plan, loading, error } = usePlan(start, end, precomputedRoute);
  const ctx = useMemo(() => (plan ? createContext(plan, pace) : null), [plan, pace]);
  const plans = useMemo(() => (ctx ? signalPlans(ctx, traffic) : []), [ctx, traffic]);
  const ride = useMemo(() => (ctx ? simulateRide(ctx, traffic, seed) : null), [ctx, traffic, seed]);
  const forecast = useMemo(
    () => (ctx ? runForecast(ctx, traffic, pricePlan, rates) : null),
    [ctx, traffic, pricePlan, rates]
  );

  const onFrame = useCallback((t: number) => mapRef.current?.showTime(t), []);
  const playback = usePlayback({ duration: ride?.duration ?? 0, speed, rideKey: ride, onFrame });
  const { status, time } = playback;

  // "Ride again" loads a new ride and should set straight off.
  useEffect(() => {
    if (autoplay.current && ride) {
      autoplay.current = false;
      playback.play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ride]);

  useEffect(() => {
    if (status === 'finished') mapRef.current?.fit();
  }, [status]);

  // Keep a picked route in the URL so the page can be shared.
  useEffect(() => {
    if (!canPick || !syncUrl || !pickedStart || !pickedEnd) return;
    const f = (n: number) => n.toFixed(5);
    const hash = `#ride=${f(pickedStart.lat)},${f(pickedStart.lng)};${f(pickedEnd.lat)},${f(pickedEnd.lng)};${seed}`;
    window.history.replaceState(null, '', hash);
  }, [canPick, syncUrl, pickedStart, pickedEnd, seed]);

  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === root.current);
    document.addEventListener('fullscreenchange', update);
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);

  const setEnd = useCallback((which: 'start' | 'end', place: Location | null) => {
    (which === 'start' ? setPickedStart : setPickedEnd)(place);
  }, []);

  const pickOnMap = useCallback(
    (which: 'start' | 'end', lat: number, lng: number) => {
      setEnd(which, { lat, lng });
      setPicking(which === 'start' && !pickedEnd ? 'end' : null);
      // Name the pin once the geocoder answers, unless it has moved again.
      nameOf(lat, lng).then((label) => {
        if (!label) return;
        (which === 'start' ? setPickedStart : setPickedEnd)((current) =>
          current && current.lat === lat && current.lng === lng ? { ...current, label } : current
        );
      });
    },
    [pickedEnd, setEnd]
  );

  // ---- Where the ride is right now -----------------------------------------
  const now = useMemo(() => {
    if (!plan || !ctx || !ride) return null;
    const { distance, speed: v } = sampleAt(ride, time);
    const finished = time >= ride.duration;
    const stop = ride.stops.find((s) => time >= s.at && time < s.at + s.wait);
    const lost = finished
      ? ride.delay
      : Math.max(0, time - timeAtDistance(ctx.freeFlow, distance));
    const walking = plan.steps.some((s) => s.walk && distance >= s.from && distance < s.to);
    return {
      distance,
      speed: v,
      stop,
      lost,
      walking,
      stopsSoFar: ride.stops.filter((s) => s.at <= time).length,
      street: streetAt(plan.steps, distance),
      fare:
        time > 0
          ? limeFare(pricePlan, time, rates)
          : pricePlan === 'payg'
            ? rates.unlockFee
            : pricePlan === 'prime'
              ? LIME.prime.shortFare
              : 0,
    };
  }, [plan, ctx, ride, time, pricePlan, rates]);

  const speeds = useMemo(
    () => (SPEEDS.includes(simulationSpeed) ? SPEEDS : [...SPEEDS, simulationSpeed].sort((a, b) => a - b)),
    [simulationSpeed]
  );

  const junctions = plan?.signals.filter((s) => s.kind === 'junction').length ?? 0;
  const crossings = (plan?.signals.length ?? 0) - junctions;
  const routeTitle =
    start?.label && end?.label ? `${start.label} → ${end.label}` : plan ? 'Your route' : '';

  let statusText = '';
  if (now && ride) {
    if (status === 'ready') statusText = 'Ready to unlock';
    else if (status === 'finished') statusText = `Arrived in ${clock(ride.duration)}`;
    else if (now.stop) {
      statusText = `Red light${now.street ? ` on ${now.street}` : ''} · waiting ${clock(time - now.stop.at)}`;
    } else if (status === 'paused') statusText = 'Paused';
    else if (now.walking) statusText = 'Pushing the bike';
    else statusText = `${Math.round(now.speed * 3.6)} km/h${now.street ? ` on ${now.street}` : ''}`;
  }

  const total = ride ? limeFare(pricePlan, ride.duration, rates) : 0;
  const extra = ride && ctx ? total - limeFare(pricePlan, ctx.freeFlow.duration, rates) : 0;
  const shareText =
    plan && ride
      ? `My ${formatDistance(plan.distance)} Lime ride cost ${formatPounds(total)}. Red lights added ${duration(ride.delay)}${
          extra >= 0.005 ? ` and ${formatMoney(extra)} to the bill` : ''
        }. Lime charges by the minute, so the meter keeps running at every red.`
      : '';

  const toggleFullscreen = () => {
    if (document.fullscreenElement) void document.exitFullscreen();
    else void root.current?.requestFullscreen?.();
  };

  return (
    <div
      ref={root}
      className={styles.root}
      data-component="lime-simulator"
      data-theme={dark ? 'dark' : 'light'}
      data-status={plan ? status : loading ? 'loading' : 'idle'}
      data-fullscreen={fullscreen}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        ['--lbs-height' as string]: typeof height === 'number' ? `${height}px` : height,
      }}
    >
      <div className={styles.layout}>
        <div className={styles.mapWrap}>
          <MapCanvas
            ref={mapRef}
            plan={plan}
            ride={ride}
            signalPlans={plans}
            start={start}
            end={end}
            playing={status === 'playing'}
            picking={canPick ? picking : null}
            canMoveEnds={canPick}
            onPick={pickOnMap}
            onFollowChange={setFollowing}
            tileUrl={tileUrl}
            tileAttribution={tileAttribution}
          />
          <div className={styles.mapButtons}>
            {status === 'playing' && !following && (
              <button
                type="button"
                className={styles.mapButton}
                onClick={() => mapRef.current?.follow()}
                data-action="follow"
              >
                Follow rider
              </button>
            )}
            <button
              type="button"
              className={styles.mapButton}
              onClick={toggleFullscreen}
              aria-label={fullscreen ? 'Exit full screen' : 'Full screen'}
              title={fullscreen ? 'Exit full screen' : 'Full screen'}
              data-action="toggle-fullscreen"
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {fullscreen ? (
                  <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
                ) : (
                  <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className={styles.panel}>
          {!plan && (
            <header className={styles.intro}>
              <h2>What do red lights cost you?</h2>
              <p>
                Lime charges by the minute, so the meter keeps running while you wait at a red.
                Pick a ride across London and see how much of the fare goes on standing still.
              </p>
            </header>
          )}

          {canPick && (
            <PlacePicker
              start={pickedStart}
              end={pickedEnd}
              picking={picking}
              onPicking={setPicking}
              onStart={(place) => {
                setEnd('start', place);
                if (place && !pickedEnd) setPicking('end');
              }}
              onEnd={(place) => {
                setEnd('end', place);
                if (place) setPicking(pickedStart ? null : 'start');
              }}
              onRoute={(a, b) => {
                setPickedStart(a);
                setPickedEnd(b);
                setPicking(null);
              }}
            />
          )}

          {loading && (
            <div className={styles.notice} role="status">
              <span className={styles.spinner} aria-hidden="true" />
              Finding a cycling route and its traffic lights…
            </div>
          )}
          {error && !loading && (
            <div className={styles.notice} data-tone="error" role="alert">
              {error}
            </div>
          )}

          {plan && ride && ctx && now && forecast && (
            <>
              <header className={styles.routeHead}>
                {!canPick && routeTitle && <h2>{routeTitle}</h2>}
                <p>
                  {formatDistance(plan.distance)} ·{' '}
                  {plan.signals.length === 0
                    ? 'no traffic lights'
                    : `${plural(junctions, 'signalled junction')}${
                        crossings ? `, ${plural(crossings, 'crossing')}` : ''
                      }`}{' '}
                  · about {Math.round(forecast.meanDuration / 60)} min
                </p>
              </header>

              {plan.drivingFallback && (
                <div className={styles.notice} data-tone="warning">
                  The cycling router is not answering, so this is a driving route. It may use roads
                  a bike would avoid.
                </div>
              )}
              {plan.signalSource === 'unavailable' && (
                <div className={styles.notice} data-tone="warning">
                  Traffic lights could not be loaded for this area, so none are shown. Routes inside
                  Greater London always work.
                </div>
              )}

              <section className={styles.meter} data-waiting={now.stop ? 'true' : 'false'} data-component="meter">
                <div className={styles.meterTop}>
                  <div>
                    <div className={styles.meterLabel}>
                      {status === 'finished' ? 'Final fare' : 'Fare so far'}
                    </div>
                    <div className={styles.meterFare} data-testid="fare">
                      {formatPounds(now.fare)}
                    </div>
                  </div>
                  <div className={styles.meterLost}>
                    <div className={styles.meterLabel}>Lost to red lights</div>
                    <div className={styles.meterLostValue} data-testid="lost">
                      {clock(now.lost)}
                    </div>
                    <div className={styles.meterSub}>{plural(now.stopsSoFar, 'stop')}</div>
                  </div>
                </div>
                <div className={styles.meterStatus} role="status">
                  <span className={styles.statusDot} data-state={now.stop ? 'red' : status} />
                  <span>{statusText}</span>
                  <span className={styles.meterClock}>
                    {clock(time)} · {formatDistance(now.distance)}
                  </span>
                </div>
                <RouteStrip
                  plan={plan}
                  ride={ride}
                  signalPlans={plans}
                  time={time}
                  distance={now.distance}
                  onSeek={(metres) => playback.seek(timeAtDistance(ride, metres))}
                />
                {showControls && (
                  <div className={styles.controls} data-component="simulation-controls">
                    {status === 'finished' ? (
                      <button
                        type="button"
                        className={styles.primaryButton}
                        data-action="ride-again"
                        onClick={() => {
                          autoplay.current = true;
                          setSeed(randomSeed());
                        }}
                      >
                        Ride again
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={styles.primaryButton}
                        data-action={status === 'playing' ? 'pause' : 'play'}
                        onClick={status === 'playing' ? playback.pause : playback.play}
                      >
                        {status === 'playing' ? 'Pause' : status === 'paused' ? 'Resume' : 'Start ride'}
                      </button>
                    )}
                    {status === 'finished' ? (
                      <button
                        type="button"
                        className={styles.ghostButton}
                        data-action="replay"
                        onClick={playback.play}
                      >
                        Watch replay
                      </button>
                    ) : (
                      <button
                        type="button"
                        className={styles.ghostButton}
                        data-action="skip"
                        onClick={playback.finish}
                      >
                        Skip to end
                      </button>
                    )}
                    <div className={styles.speeds} role="radiogroup" aria-label="Playback speed">
                      {speeds.map((s) => (
                        <button
                          key={s}
                          type="button"
                          role="radio"
                          aria-checked={s === speed}
                          title={s === 1 ? 'Real time' : `${s} times faster than real time`}
                          data-action="speed-change"
                          data-speed={s}
                          onClick={() => setSpeed(s)}
                        >
                          {s}×
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {status === 'finished' && (
                <Receipt
                  plan={plan}
                  ctx={ctx}
                  ride={ride}
                  forecast={forecast}
                  pricePlan={pricePlan}
                  rates={rates}
                />
              )}

              <ForecastCard
                forecast={forecast}
                yourDelay={status === 'finished' ? ride.delay : null}
                signalCount={plan.signals.length}
              />

              {status === 'finished' && !precomputedRoute && <ShareRow text={shareText} />}

              <Assumptions
                pace={pace}
                traffic={traffic}
                pricePlan={pricePlan}
                rates={rates}
                plan={plan}
                onPace={setPace}
                onTraffic={setTraffic}
                onPricePlan={setPricePlan}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
