import type { PricePlan, RoutePlan } from '../types';
import type { Forecast } from '../engine/forecast';
import type { Ride, RideContext } from '../engine/ride';
import { type Rates } from '../engine/pricing';
interface Props {
    plan: RoutePlan;
    ctx: RideContext;
    ride: Ride;
    forecast: Forecast;
    pricePlan: PricePlan;
    rates: Rates;
}
/** The itemised bill for a finished ride, and what the lights added to it. */
export declare function Receipt({ plan, ctx, ride, forecast, pricePlan, rates }: Props): import("react/jsx-runtime").JSX.Element;
export {};
