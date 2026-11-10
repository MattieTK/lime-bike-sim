import { useCallback, useEffect, useRef, useState } from 'react';

export type PlaybackStatus = 'ready' | 'playing' | 'paused' | 'finished';

interface Options {
  /** Length of the ride in seconds. */
  duration: number;
  /** Ride seconds per real second. */
  speed: number;
  /** Changes whenever a different ride is loaded; playback rewinds. */
  rideKey: unknown;
  /** Called on every animation frame with the current ride time. */
  onFrame: (time: number) => void;
}

const UI_INTERVAL_MS = 80;

/**
 * Drives the ride clock. The map is updated on every frame through `onFrame`;
 * React state only refreshes about twelve times a second, which is plenty for
 * the read-outs and keeps the panel cheap to render.
 */
export function usePlayback({ duration, speed, rideKey, onFrame }: Options) {
  const [status, setStatus] = useState<PlaybackStatus>('ready');
  const [time, setTime] = useState(0);

  const timeRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const lastUiRef = useRef(0);
  const live = useRef({ duration, speed, onFrame });
  live.current = { duration, speed, onFrame };

  const stopLoop = useCallback(() => {
    if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }, []);

  const show = useCallback((t: number) => {
    timeRef.current = t;
    live.current.onFrame(t);
    setTime(t);
  }, []);

  const tick = useCallback(
    (now: number) => {
      const { duration: total, speed: rate, onFrame: frame } = live.current;
      // Cap the step so a backgrounded tab does not leap ahead on return.
      const elapsed = Math.min(0.1, (now - lastFrameRef.current) / 1000);
      lastFrameRef.current = now;
      const t = Math.min(total, timeRef.current + elapsed * rate);
      timeRef.current = t;
      frame(t);
      if (t >= total) {
        frameRef.current = null;
        setTime(t);
        setStatus('finished');
        return;
      }
      if (now - lastUiRef.current >= UI_INTERVAL_MS) {
        lastUiRef.current = now;
        setTime(t);
      }
      frameRef.current = requestAnimationFrame(tick);
    },
    []
  );

  const play = useCallback(() => {
    if (live.current.duration <= 0) return;
    if (timeRef.current >= live.current.duration) show(0);
    stopLoop();
    lastFrameRef.current = performance.now();
    setStatus('playing');
    frameRef.current = requestAnimationFrame(tick);
  }, [show, stopLoop, tick]);

  const pause = useCallback(() => {
    stopLoop();
    setTime(timeRef.current);
    setStatus((s) => (s === 'playing' ? 'paused' : s));
  }, [stopLoop]);

  const seek = useCallback(
    (t: number) => {
      const total = live.current.duration;
      const clamped = Math.max(0, Math.min(total, t));
      show(clamped);
      if (clamped >= total) {
        stopLoop();
        setStatus('finished');
      } else {
        setStatus((s) => (s === 'playing' ? s : clamped > 0 ? 'paused' : 'ready'));
      }
    },
    [show, stopLoop]
  );

  const finish = useCallback(() => seek(live.current.duration), [seek]);

  // A new ride always starts from the beginning.
  useEffect(() => {
    stopLoop();
    setStatus('ready');
    show(0);
  }, [rideKey, show, stopLoop]);

  useEffect(() => stopLoop, [stopLoop]);

  return { status, time, play, pause, seek, finish };
}
