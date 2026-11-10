import type { PricePlan } from '../types';

/**
 * London prices. These change often: update the numbers and `PRICES_CHECKED`
 * together. Sources: operator apps as reported by fleethopper.co.uk (checked
 * September-October 2026), Lime's help centre for the rounding rule, and Time
 * Out (March 2026) for LimePrime.
 */
export const PRICES_CHECKED = 'autumn 2026';

export const LIME = {
  unlock: 1.0,
  perMinute: 0.33,
  /** LimePass: 400 minutes for £36.99, valid 30 days, no unlock fee. */
  pass: { minutes: 400, price: 36.99, perMinute: 36.99 / 400 },
  /** LimePrime: £6.99 a month, then flat fares with unlocks included. */
  prime: { monthly: 6.99, shortMinutes: 5, shortFare: 1.0, capMinutes: 20, fare: 1.7 },
} as const;

/** Lime rounds ride time up to the next full minute. */
export function billedMinutes(seconds: number): number {
  return Math.max(1, Math.ceil(seconds / 60 - 1e-6));
}

export interface Rates {
  unlockFee: number;
  perMinuteRate: number;
}

/** What Lime charges for a ride of `seconds` on a given plan. */
export function limeFare(plan: PricePlan, seconds: number, rates: Rates): number {
  const minutes = billedMinutes(seconds);
  switch (plan) {
    case 'payg':
      return rates.unlockFee + minutes * rates.perMinuteRate;
    case 'pass':
      return minutes * LIME.pass.perMinute;
    case 'prime': {
      if (minutes <= LIME.prime.shortMinutes) return LIME.prime.shortFare;
      // Past 20 minutes Lime charges an unpublished "discounted" per-minute
      // rate; the pay-as-you-go rate is used here as an upper bound.
      const extra = Math.max(0, minutes - LIME.prime.capMinutes);
      return LIME.prime.fare + extra * rates.perMinuteRate;
    }
  }
}

export const PLAN_LABELS: Record<PricePlan, { name: string; detail: string }> = {
  payg: { name: 'Pay as you go', detail: 'Unlock fee, then every started minute' },
  pass: { name: 'LimePass', detail: '400 prepaid minutes for £36.99' },
  prime: { name: 'LimePrime', detail: '£6.99 a month, £1.70 a ride up to 20 min' },
};

export interface Alternative {
  id: string;
  name: string;
  /** How the price is worked out, in a few words. */
  basis: string;
  model: 'time' | 'distance' | 'flat';
  fare: (seconds: number, metres: number) => number;
}

/** Other ways to make the same trip by hire bike, each priced by its own rules. */
export function alternatives(rates: Rates): Alternative[] {
  return [
    {
      id: 'lime-pass',
      name: 'Lime with LimePass',
      basis: '9p a minute, prepaid',
      model: 'time',
      fare: (sec) => limeFare('pass', sec, rates),
    },
    {
      id: 'lime-prime',
      name: 'Lime with LimePrime',
      basis: 'Flat £1.70 up to 20 min',
      model: 'flat',
      fare: (sec) => limeFare('prime', sec, rates),
    },
    {
      id: 'voi',
      name: 'Voi e-bike',
      basis: '27p a minute, no unlock fee',
      model: 'time',
      fare: (sec) => billedMinutes(sec) * 0.27,
    },
    {
      id: 'bolt-mile',
      name: 'Bolt e-bike, by distance',
      basis: '£1 + 43p a mile',
      model: 'distance',
      fare: (_sec, metres) => 1 + (metres / 1609.344) * 0.43,
    },
    {
      id: 'santander',
      name: 'Santander Cycles e-bike',
      basis: '£3 per 30 minutes',
      model: 'flat',
      fare: (sec) => 3 * Math.max(1, Math.ceil(sec / 1800 - 1e-6)),
    },
  ];
}

export function formatPounds(amount: number): string {
  return `£${amount.toFixed(2)}`;
}

/** Small amounts read better in pence: 66p rather than £0.66. */
export function formatMoney(amount: number): string {
  const pence = Math.round(amount * 100);
  return Math.abs(pence) < 100 ? `${pence}p` : formatPounds(amount);
}
