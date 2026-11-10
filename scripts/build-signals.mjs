#!/usr/bin/env node
/**
 * Build the bundled London traffic-signal dataset from an OpenStreetMap extract.
 *
 * The simulator used to ask the public Overpass API for traffic lights on every
 * route. Those servers are frequently overloaded, so the lights now ship with
 * the component and only routes outside Greater London fall back to Overpass.
 *
 * Usage:
 *   curl -LO https://download.geofabrik.de/europe/united-kingdom/england/greater-london-latest.osm.pbf
 *   curl -LO https://download.geofabrik.de/europe/united-kingdom/england/greater-london.poly
 *   node scripts/build-signals.mjs greater-london-latest.osm.pbf greater-london.poly
 *
 * Output: src/data/london-signals.json
 *   { generated, source, polygon: [[lng,lat],...], count, signals: [dLat, lng, kind, bearing, ...] }
 *   - coordinates are integers in 1e-5 degrees; lat is delta-encoded (sorted by lat),
 *     lng is an offset from `origin[0]`
 *   - kind: 0 = signalled junction, 1 = signalled pedestrian/cycle crossing
 *   - bearing: direction of travel the signal applies to, in 2° steps (0-179),
 *     or -1 when it applies to every approach
 */
import { createOSMStream } from 'osm-pbf-parser-node';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const [pbfPath, polyPath] = process.argv.slice(2);
if (!pbfPath || !polyPath) {
  console.error('Usage: node scripts/build-signals.mjs <extract.osm.pbf> <extract.poly>');
  process.exit(1);
}

const ROAD_CLASSES = new Set([
  'motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'unclassified', 'residential',
  'living_street', 'motorway_link', 'trunk_link', 'primary_link', 'secondary_link',
  'tertiary_link', 'busway',
]);
const JUNCTION_RADIUS_M = 22; // a signal this close to a road junction controls that junction

const toRad = (d) => (d * Math.PI) / 180;
function metres(lat1, lon1, lat2, lon2) {
  const x = toRad(lon2 - lon1) * Math.cos(toRad((lat1 + lat2) / 2));
  const y = toRad(lat2 - lat1);
  return Math.sqrt(x * x + y * y) * 6371000;
}
function bearing(lat1, lon1, lat2, lon2) {
  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

// ---- Pass 1: signal nodes, then the road ways that touch them -------------
const signals = new Map(); // id -> { lat, lon, crossing, dir, ways: [{prev,next}] }
const arms = new Map(); // road node id -> number of road arms meeting there
let nodeCount = 0;

console.error('Pass 1: reading signals and roads…');
for await (const item of createOSMStream(pbfPath, { withInfo: false })) {
  if (item.type === 'node') {
    nodeCount++;
    const t = item.tags;
    if (!t) continue;
    const isSignal = t.highway === 'traffic_signals';
    const isCrossing =
      t.highway === 'crossing' &&
      (t.crossing === 'traffic_signals' || t['crossing:signals'] === 'yes');
    if (!isSignal && !isCrossing) continue;
    const dir = t['traffic_signals:direction'] ?? t.direction;
    signals.set(item.id, {
      lat: item.lat,
      lon: item.lon,
      crossing: isCrossing,
      dir: dir === 'forward' || dir === 'backward' ? dir : null,
      ways: [],
    });
  } else if (item.type === 'way') {
    const hw = item.tags?.highway;
    if (!hw || !ROAD_CLASSES.has(hw)) continue;
    const refs = item.refs;
    for (let i = 0; i < refs.length; i++) {
      const id = refs[i];
      const interior = i > 0 && i < refs.length - 1;
      arms.set(id, (arms.get(id) ?? 0) + (interior ? 2 : 1));
      const s = signals.get(id);
      if (s) s.ways.push({ prev: refs[i - 1] ?? null, next: refs[i + 1] ?? null });
    }
  }
}
console.error(`  ${nodeCount.toLocaleString()} nodes, ${signals.size.toLocaleString()} signal nodes`);

// ---- Pass 2: coordinates for junction nodes and signal neighbours ---------
const wanted = new Map(); // id -> [lat, lon]
for (const [id, n] of arms) if (n >= 3) wanted.set(id, null);
const junctionIds = new Set(wanted.keys());
for (const s of signals.values())
  for (const w of s.ways) {
    if (w.prev != null) wanted.set(w.prev, null);
    if (w.next != null) wanted.set(w.next, null);
  }
arms.clear();

console.error('Pass 2: resolving coordinates…');
for await (const item of createOSMStream(pbfPath, { withInfo: false })) {
  if (item.type === 'way') break; // nodes come first in a sorted extract
  if (item.type !== 'node') continue;
  if (wanted.has(item.id)) wanted.set(item.id, [item.lat, item.lon]);
}

// Spatial grid of junction nodes (~110 m cells)
const CELL = 0.001;
const grid = new Map();
const key = (lat, lon) => `${Math.floor(lat / CELL)}:${Math.floor(lon / CELL)}`;
for (const id of junctionIds) {
  const c = wanted.get(id);
  if (!c) continue;
  const k = key(c[0], c[1]);
  if (!grid.has(k)) grid.set(k, []);
  grid.get(k).push(c);
}
function nearJunction(lat, lon) {
  const cy = Math.floor(lat / CELL);
  const cx = Math.floor(lon / CELL);
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) {
      const cell = grid.get(`${cy + dy}:${cx + dx}`);
      if (!cell) continue;
      for (const [jl, jo] of cell) if (metres(lat, lon, jl, jo) <= JUNCTION_RADIUS_M) return true;
    }
  return false;
}

// ---- Classify and encode ---------------------------------------------------
const out = [];
let junctions = 0;
let crossings = 0;
let directed = 0;
for (const [id, s] of signals) {
  // Crossing unless it is a traffic_signals node at, or right next to, a road junction.
  const kind = !s.crossing && (junctionIds.has(id) || nearJunction(s.lat, s.lon)) ? 0 : 1;
  let b = -1;
  if (s.dir && s.ways.length === 1) {
    const w = s.ways[0];
    // "forward" = the signal faces traffic travelling in the way's drawing direction.
    const from = s.dir === 'forward' ? w.prev : w.next;
    const c = from != null ? wanted.get(from) : null;
    if (c) b = Math.round(bearing(c[0], c[1], s.lat, s.lon) / 2) % 180;
    else {
      const to = s.dir === 'forward' ? w.next : w.prev;
      const d = to != null ? wanted.get(to) : null;
      if (d) b = Math.round(bearing(s.lat, s.lon, d[0], d[1]) / 2) % 180;
    }
  }
  if (b >= 0) directed++;
  kind === 0 ? junctions++ : crossings++;
  out.push([Math.round(s.lat * 1e5), Math.round(s.lon * 1e5), kind, b]);
}
out.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

const originLng = Math.min(...out.map((r) => r[1]));
const originLat = out[0][0];
const flat = [];
let prevLat = originLat;
for (const [lat, lng, kind, b] of out) {
  flat.push(lat - prevLat, lng - originLng, kind, b);
  prevLat = lat;
}

// ---- Coverage polygon (Osmosis .poly, simplified) --------------------------
const ring = readFileSync(polyPath, 'utf8')
  .split('\n')
  .map((l) => l.trim().split(/\s+/).map(Number))
  .filter((p) => p.length === 2 && p.every(Number.isFinite));

function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const keep = new Uint8Array(points.length);
  keep[0] = keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    let worst = 0;
    let index = -1;
    const [ax, ay] = points[a];
    const [bx, by] = points[b];
    const len = Math.hypot(bx - ax, by - ay) || 1e-12;
    for (let i = a + 1; i < b; i++) {
      const d = Math.abs((bx - ax) * (ay - points[i][1]) - (ax - points[i][0]) * (by - ay)) / len;
      if (d > worst) { worst = d; index = i; }
    }
    if (worst > tolerance) { keep[index] = 1; stack.push([a, index], [index, b]); }
  }
  return points.filter((_, i) => keep[i]);
}
// The ring is closed, so simplify it as two open halves.
const half = Math.floor(ring.length / 2);
const polygon = [...simplify(ring.slice(0, half + 1), 0.002), ...simplify(ring.slice(half), 0.002).slice(1)].map(([x, y]) => [+x.toFixed(4), +y.toFixed(4)]);

const dataset = {
  generated: new Date().toISOString().slice(0, 10),
  source: 'OpenStreetMap contributors (ODbL), via Geofabrik Greater London extract',
  origin: [originLng, originLat],
  polygon,
  count: out.length,
  signals: flat,
};

const dest = resolve(dirname(fileURLToPath(import.meta.url)), '../src/data/london-signals.json');
mkdirSync(dirname(dest), { recursive: true });
writeFileSync(dest, JSON.stringify(dataset));
console.error(
  `Wrote ${dest}\n  ${junctions} junction signals, ${crossings} crossing signals, ${directed} with a direction, polygon ${polygon.length} pts`
);
