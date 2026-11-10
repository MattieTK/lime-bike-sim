import type { RouteSignal, RouteStep, SignalKind, SignalSource } from '../types';
import { angleBetween, inPolygon, projectOntoLine, type LngLat } from './geo';
import { hashInts } from './rng';
import { streetAt } from './routing';

/** A mapped signal node, before it is matched to a route. */
export interface SignalNode {
  lat: number;
  lng: number;
  kind: SignalKind;
  /** Direction of travel the signal applies to, degrees, or -1 for every approach. */
  bearing: number;
}

// How close a mapped signal has to be to the route line to count.
// Junction signals are often drawn on the other carriageway or a side arm;
// a crossing only matters if the route actually goes through it.
const JUNCTION_REACH_M = 18;
const CROSSING_REACH_M = 8;
// Signal nodes this close together along the route are one set of lights.
const CLUSTER_GAP_M = 40;
const CLUSTER_SPAN_M = 80;

/**
 * Match mapped signal nodes to a route and merge them into the sets of lights
 * a rider would actually experience.
 */
export function matchSignals(
  nodes: SignalNode[],
  coordinates: LngLat[],
  cum: ArrayLike<number>,
  steps: RouteStep[]
): RouteSignal[] {
  const total = cum[cum.length - 1];
  const hits: { along: number; node: SignalNode }[] = [];

  for (const node of nodes) {
    const reach = node.kind === 'junction' ? JUNCTION_REACH_M : CROSSING_REACH_M;
    for (const p of projectOntoLine(node.lat, node.lng, coordinates, cum, reach)) {
      // A stop line drawn on our own carriageway but facing the other way is
      // the far side of the junction: it belongs to oncoming traffic.
      if (node.bearing >= 0 && p.offset <= 6 && angleBetween(p.bearing, node.bearing) > 110) {
        continue;
      }
      // Lights right at the very start or end are not ridden through.
      if (p.along < 8 || p.along > total - 8) continue;
      hits.push({ along: p.along, node });
    }
  }
  hits.sort((a, b) => a.along - b.along);

  const signals: RouteSignal[] = [];
  let cluster: typeof hits = [];
  const flush = () => {
    if (!cluster.length) return;
    const first = cluster[0];
    const kind: SignalKind = cluster.some((h) => h.node.kind === 'junction')
      ? 'junction'
      : 'crossing';
    signals.push({
      id: hashInts(Math.round(first.node.lat * 1e5), Math.round(first.node.lng * 1e5)),
      lat: first.node.lat,
      lng: first.node.lng,
      distance: first.along,
      kind,
      name: streetAt(steps, first.along),
    });
    cluster = [];
  };
  for (const hit of hits) {
    const last = cluster[cluster.length - 1];
    if (last && (hit.along - last.along > CLUSTER_GAP_M || hit.along - cluster[0].along > CLUSTER_SPAN_M)) {
      flush();
    }
    cluster.push(hit);
  }
  flush();
  return signals;
}

// ---- Bundled London dataset -------------------------------------------------

interface Dataset {
  generated: string;
  origin: [number, number];
  polygon: LngLat[];
  count: number;
  signals: number[];
}

interface SignalIndex {
  generated: string;
  polygon: LngLat[];
  nodes: SignalNode[];
  grid: Map<number, number[]>;
}

const CELL_LAT = 0.002; // ~220 m
const CELL_LNG = 0.003; // ~210 m at London's latitude
const cellKey = (lat: number, lng: number) =>
  Math.floor(lat / CELL_LAT) * 100000 + Math.floor((lng + 180) / CELL_LNG);

let indexPromise: Promise<SignalIndex> | null = null;

function loadIndex(): Promise<SignalIndex> {
  indexPromise ??= import('../data/london-signals.json').then((mod) => {
    const data = ((mod as { default?: unknown }).default ?? mod) as Dataset;
    const nodes: SignalNode[] = [];
    const grid = new Map<number, number[]>();
    let lat = data.origin[1];
    for (let i = 0; i < data.signals.length; i += 4) {
      lat += data.signals[i];
      const node: SignalNode = {
        lat: lat / 1e5,
        lng: (data.origin[0] + data.signals[i + 1]) / 1e5,
        kind: data.signals[i + 2] === 0 ? 'junction' : 'crossing',
        bearing: data.signals[i + 3] < 0 ? -1 : data.signals[i + 3] * 2,
      };
      const key = cellKey(node.lat, node.lng);
      const cell = grid.get(key);
      if (cell) cell.push(nodes.length);
      else grid.set(key, [nodes.length]);
      nodes.push(node);
    }
    return { generated: data.generated, polygon: data.polygon, nodes, grid };
  });
  return indexPromise;
}

function nodesNearRoute(index: SignalIndex, coordinates: LngLat[]): SignalNode[] {
  const picked = new Set<number>();
  const visit = (lat: number, lng: number) => {
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const cell = index.grid.get(cellKey(lat + dy * CELL_LAT, lng + dx * CELL_LNG));
        if (cell) for (const i of cell) picked.add(i);
      }
  };
  for (let i = 0; i < coordinates.length; i++) {
    const [lng, lat] = coordinates[i];
    visit(lat, lng);
    // Long straight segments can jump over a grid cell, so walk along them too.
    if (i > 0) {
      const [pLng, pLat] = coordinates[i - 1];
      const hops = Math.ceil(Math.max(Math.abs(lat - pLat) / CELL_LAT, Math.abs(lng - pLng) / CELL_LNG));
      for (let h = 1; h < hops; h++) {
        visit(pLat + ((lat - pLat) * h) / hops, pLng + ((lng - pLng) * h) / hops);
      }
    }
  }
  return [...picked].map((i) => index.nodes[i]);
}

// ---- Overpass fallback, for routes outside the bundled area -------------------

const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
];

async function fetchOverpassNodes(coordinates: LngLat[], signal?: AbortSignal): Promise<SignalNode[]> {
  // Thin the line so the query stays small; `around` follows the polyline between points.
  const step = Math.max(1, Math.ceil(coordinates.length / 400));
  const line = coordinates
    .filter((_, i) => i % step === 0 || i === coordinates.length - 1)
    .map(([lng, lat]) => `${lat.toFixed(5)},${lng.toFixed(5)}`)
    .join(',');
  const query = `[out:json][timeout:15];(node(around:${JUNCTION_REACH_M},${line})[highway=traffic_signals];node(around:${CROSSING_REACH_M},${line})[highway=crossing][crossing=traffic_signals];);out body;`;

  let lastError: unknown;
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const timeout = AbortSignal.timeout(15000);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `data=${encodeURIComponent(query)}`,
        signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
      });
      if (!res.ok) throw new Error(`Overpass answered ${res.status}`);
      const data = (await res.json()) as {
        elements: { lat: number; lon: number; tags?: Record<string, string> }[];
      };
      return data.elements.map((el) => ({
        lat: el.lat,
        lng: el.lon,
        kind: el.tags?.highway === 'crossing' ? 'crossing' : 'junction',
        bearing: -1,
      }));
    } catch (err) {
      if (signal?.aborted) throw err;
      lastError = err;
    }
  }
  throw lastError ?? new Error('Overpass unavailable');
}

/**
 * Find the traffic lights along a route. Greater London comes from the bundled
 * OpenStreetMap extract; anywhere else is looked up live. If the live lookup
 * fails the source is reported as 'unavailable' rather than pretending the
 * route has no lights.
 */
export async function findSignals(
  coordinates: LngLat[],
  cum: ArrayLike<number>,
  steps: RouteStep[],
  signal?: AbortSignal
): Promise<{ signals: RouteSignal[]; source: SignalSource }> {
  const index = await loadIndex();
  const probe = Math.max(1, Math.floor(coordinates.length / 40));
  const covered = coordinates.every(
    ([lng, lat], i) =>
      (i % probe !== 0 && i !== coordinates.length - 1) || inPolygon(lng, lat, index.polygon)
  );
  if (covered) {
    return {
      signals: matchSignals(nodesNearRoute(index, coordinates), coordinates, cum, steps),
      source: 'bundled',
    };
  }
  try {
    const nodes = await fetchOverpassNodes(coordinates, signal);
    return { signals: matchSignals(nodes, coordinates, cum, steps), source: 'overpass' };
  } catch (err) {
    if (signal?.aborted) throw err;
    return { signals: [], source: 'unavailable' };
  }
}
