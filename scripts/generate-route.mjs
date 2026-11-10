#!/usr/bin/env node
/**
 * Generate precomputed route data for a given start and end, so a page can
 * embed the simulator without any routing request at view time.
 *
 * Usage:
 *   npm run generate-route -- <startLat> <startLng> <endLat> <endLng> > route.json
 *
 * Example:
 *   npm run generate-route -- 51.5007 -0.1246 51.5155 -0.1419 > bigben-to-oxford.json
 *
 * Pass the JSON to the component as the `precomputedRoute` prop.
 */
import { build } from 'esbuild';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const [startLat, startLng, endLat, endLng] = process.argv.slice(2).map(Number);
if (![startLat, startLng, endLat, endLng].every(Number.isFinite)) {
  console.error('Usage: npm run generate-route -- <startLat> <startLng> <endLat> <endLng>');
  process.exit(1);
}

// Reuse the simulator's own route and traffic-light code by bundling it for Node.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = mkdtempSync(join(tmpdir(), 'lime-route-'));
const bundle = join(out, 'plan.mjs');
try {
  await build({
    entryPoints: [join(root, 'src/engine/plan.ts')],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile: bundle,
    logLevel: 'error',
  });
  const { buildPlan, toPrecomputed } = await import(pathToFileURL(bundle).href);

  console.error(`Routing (${startLat}, ${startLng}) → (${endLat}, ${endLng})…`);
  const plan = await buildPlan({ lat: startLat, lng: startLng }, { lat: endLat, lng: endLng });
  if (plan.drivingFallback) console.error('Warning: bike router unavailable, this is a driving route.');
  if (plan.signalSource === 'unavailable') console.error('Warning: traffic lights could not be loaded.');
  console.error(
    `${(plan.distance / 1000).toFixed(2)} km, ${plan.signals.length} sets of lights (source: ${plan.signalSource})`
  );
  console.log(JSON.stringify(toPrecomputed(plan)));
} finally {
  rmSync(out, { recursive: true, force: true });
}
