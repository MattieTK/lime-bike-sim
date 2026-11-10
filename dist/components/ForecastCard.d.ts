import type { Forecast } from '../engine/forecast';
interface Props {
    forecast: Forecast;
    /** Seconds this ride lost to lights, once it has finished. */
    yourDelay: number | null;
    signalCount: number;
}
/** What red lights cost on this route across hundreds of simulated departures. */
export declare function ForecastCard({ forecast, yourDelay, signalCount }: Props): import("react/jsx-runtime").JSX.Element;
export {};
