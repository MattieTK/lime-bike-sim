import type { PricePlan } from '../types';
/**
 * London prices. These change often: update the numbers and `PRICES_CHECKED`
 * together. Sources: operator apps as reported by fleethopper.co.uk (checked
 * September-October 2026), Lime's help centre for the rounding rule, and Time
 * Out (March 2026) for LimePrime.
 */
export declare const PRICES_CHECKED = "autumn 2026";
export declare const LIME: {
    readonly unlock: 1;
    readonly perMinute: 0.33;
    /** LimePass: 400 minutes for £36.99, valid 30 days, no unlock fee. */
    readonly pass: {
        readonly minutes: 400;
        readonly price: 36.99;
        readonly perMinute: number;
    };
    /** LimePrime: £6.99 a month, then flat fares with unlocks included. */
    readonly prime: {
        readonly monthly: 6.99;
        readonly shortMinutes: 5;
        readonly shortFare: 1;
        readonly capMinutes: 20;
        readonly fare: 1.7;
    };
};
/** Lime rounds ride time up to the next full minute. */
export declare function billedMinutes(seconds: number): number;
export interface Rates {
    unlockFee: number;
    perMinuteRate: number;
}
/** What Lime charges for a ride of `seconds` on a given plan. */
export declare function limeFare(plan: PricePlan, seconds: number, rates: Rates): number;
export declare const PLAN_LABELS: Record<PricePlan, {
    name: string;
    detail: string;
}>;
export interface Alternative {
    id: string;
    name: string;
    /** How the price is worked out, in a few words. */
    basis: string;
    model: 'time' | 'distance' | 'flat';
    fare: (seconds: number, metres: number) => number;
}
/** Other ways to make the same trip by hire bike, each priced by its own rules. */
export declare function alternatives(rates: Rates): Alternative[];
export declare function formatPounds(amount: number): string;
/** Small amounts read better in pence: 66p rather than £0.66. */
export declare function formatMoney(amount: number): string;
