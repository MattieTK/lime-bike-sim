import type { Pace, PricePlan, RoutePlan, Traffic } from '../types';
import { type Rates } from '../engine/pricing';
interface SegmentedProps<T extends string> {
    label: string;
    value: T;
    options: {
        value: T;
        label: string;
        hint?: string;
    }[];
    onChange: (value: T) => void;
}
export declare function Segmented<T extends string>({ label, value, options, onChange }: SegmentedProps<T>): import("react/jsx-runtime").JSX.Element;
interface Props {
    pace: Pace;
    traffic: Traffic;
    pricePlan: PricePlan;
    rates: Rates;
    plan: RoutePlan;
    onPace: (pace: Pace) => void;
    onTraffic: (traffic: Traffic) => void;
    onPricePlan: (plan: PricePlan) => void;
}
/** The knobs behind the model, and a plain account of what it does and does not know. */
export declare function Assumptions({ pace, traffic, pricePlan, rates, plan, onPace, onTraffic, onPricePlan }: Props): import("react/jsx-runtime").JSX.Element;
export {};
