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
/**
 * Drives the ride clock. The map is updated on every frame through `onFrame`;
 * React state only refreshes about twelve times a second, which is plenty for
 * the read-outs and keeps the panel cheap to render.
 */
export declare function usePlayback({ duration, speed, rideKey, onFrame }: Options): {
    status: PlaybackStatus;
    time: number;
    play: () => void;
    pause: () => void;
    seek: (t: number) => void;
    finish: () => void;
};
export {};
