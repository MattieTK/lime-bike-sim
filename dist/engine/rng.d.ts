/** Small deterministic random helpers, so a ride can be replayed from its seed. */
export type Rng = () => number;
export declare function mulberry32(seed: number): Rng;
/** Mixes any number of integers into one 32-bit seed. */
export declare function hashInts(...values: number[]): number;
export declare function randomSeed(): number;
