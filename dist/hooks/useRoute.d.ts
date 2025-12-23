import { Location, Route } from '../types';

interface UseRouteResult {
    route: Route | null;
    coordinates: [number, number][];
    cumulativeDistances: number[];
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}
export declare function useRoute(startLocation: Location | undefined, endLocation: Location | undefined): UseRouteResult;
export {};
//# sourceMappingURL=useRoute.d.ts.map