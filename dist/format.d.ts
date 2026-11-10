/** 754 → "12:34" */
export declare function clock(seconds: number): string;
/** 161 → "2 min 41 s", 41 → "41 s" */
export declare function duration(seconds: number): string;
/** 2734 → "2.7 km", 640 → "640 m" */
export declare function distance(metres: number): string;
export declare function plural(n: number, one: string, many?: string): string;
