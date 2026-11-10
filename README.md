# Lime Bike Simulator

An interactive React component that answers one question: **when you hire a Lime bike in London, how much of the fare goes on waiting at red lights?**

Lime charges by the minute, so the meter keeps running while you stand at a red. Pick a ride, watch it play out on the map, and get an itemised receipt showing what the lights added to the bill.

Live demo: https://lime-bike-simulator-demo.tk.workers.dev

## What it does

- **Real cycling routes.** Search for a place, click the map, or pick an example ride. Routes come from a bicycle router, including the stretches where you have to get off and push.
- **Real traffic lights.** Every signalled junction and crossing in Greater London ships with the component (27,000 mapped signals from OpenStreetMap), so lights load instantly and do not depend on a third-party server being up.
- **A forecast, not one roll of the dice.** Each route is ridden 400 times with different departure moments. You see the average cost of the lights and how much it varies, before you press start.
- **A ride you can watch and scrub.** Lights change colour live on the map and on a route strip. Drag the strip to jump to any point.
- **An honest receipt.** Fare is billed the way Lime bills it (rounded up to the next full minute), compared with the same ride on all greens, with a list of where you stopped.
- **The same trip priced differently.** LimePass, LimePrime, Voi, Bolt's per-mile fare and Santander Cycles, each showing how much of its fare is down to red lights.
- **Light and dark themes**, a layout that stacks on phones, and a shareable link that reopens the same ride.

## Install

The package installs straight from GitHub, pinned to a release tag:

```bash
npm install github:MattieTK/lime-bike-sim#v2.0.0
```

React 18 or 19 is the only thing it needs from your project; Leaflet is bundled.

### Both versions side by side

Version 1 (built with Claude Opus 4.5 in late 2025) is published the same way, so one project can show the two together. Give each its own name in `package.json`:

```json
"dependencies": {
  "lime-bike-simulator": "github:MattieTK/lime-bike-sim#v2.0.0",
  "lime-bike-simulator-v1": "github:MattieTK/lime-bike-sim#v1.0.0"
}
```

```tsx
import { LimeBikeSimulator as SimulatorV1 } from 'lime-bike-simulator-v1/ssr-safe';
import 'lime-bike-simulator-v1/style.css';
import { LimeBikeSimulator as SimulatorV2 } from 'lime-bike-simulator/ssr-safe';
import 'lime-bike-simulator/style.css';
```

The two stylesheets use different class names and do not interfere. Each version carries its own copy of Leaflet.

## Usage

```tsx
import { LimeBikeSimulator } from 'lime-bike-simulator';
import 'lime-bike-simulator/style.css';

// Let visitors pick their own route
<LimeBikeSimulator height={640} />

// Or fix the route
<LimeBikeSimulator
  startLocation={{ lat: 51.5007, lng: -0.1246, label: 'Big Ben' }}
  endLocation={{ lat: 51.5155, lng: -0.1419, label: 'Oxford Circus' }}
/>
```

### In Astro, or anywhere that renders on the server

Leaflet needs a browser, so use the lazy entry point:

```astro
---
import { LimeBikeSimulator } from 'lime-bike-simulator/ssr-safe';
import 'lime-bike-simulator/style.css';
---
<LimeBikeSimulator client:only="react" height={640} />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `startLocation` | `Location` | - | Start, as `{ lat, lng, label? }` |
| `endLocation` | `Location` | - | Destination |
| `precomputedRoute` | `PrecomputedRoute` | - | Route data shipped with the page; skips the routing request |
| `unlockFee` | `number` | `1.00` | Pay-as-you-go unlock fee, GBP |
| `perMinuteRate` | `number` | `0.33` | Pay-as-you-go price per started minute, GBP |
| `simulationSpeed` | `number` | `30` | Playback speed (ride seconds per real second) |
| `width` | `string \| number` | `'100%'` | Component width |
| `height` | `string \| number` | `600` | Height when map and panel sit side by side. On narrow screens the panel flows below the map instead. |
| `showControls` | `boolean` | `true` | Show the play, skip and speed controls |
| `allowLocationPicker` | `boolean` | `true` | Let visitors choose a route when none is passed in |
| `theme` | `'auto' \| 'light' \| 'dark'` | `'auto'` | Colour scheme; `auto` follows the visitor's system |
| `pace` | `'relaxed' \| 'typical' \| 'fast'` | `'typical'` | Initial rider pace (17, 21 or 25 km/h cruising) |
| `traffic` | `'quiet' \| 'typical' \| 'rush'` | `'typical'` | Initial traffic level |
| `seed` | `number` | random | Fixes the first ride, so it plays out the same way every time |
| `syncUrl` | `boolean` | `true` | Keep a picked route in the page URL (`#ride=…`) so it can be shared |
| `tileUrl`, `tileAttribution` | `string` | OpenStreetMap | Use a different basemap |

Version 1 props all still work. Two defaults changed: `perMinuteRate` (was `0.20`) and `simulationSpeed` (was `10`).

### Precomputed routes

```bash
npm run generate-route -- 51.5007 -0.1246 51.5155 -0.1419 > route.json
```

Pass the JSON as `precomputedRoute`. Files generated by version 1 are still accepted.

## How the model works

**Route.** From the [FOSSGIS OSRM server](https://routing.openstreetmap.de/) using its bicycle profile. (Version 1 used the OSRM demo server, which only hosts a car profile and returns a driving route whatever the URL asks for.)

**Lights.** Signal positions come from an OpenStreetMap extract of Greater London, bundled as `src/data/london-signals.json` and loaded on demand (about 115 kB gzipped). Signals drawn at each stop line of one junction are merged into a single set of lights; stop lines that face oncoming traffic are ignored; a crossing only counts if the route actually passes through it. Routes outside Greater London fall back to the Overpass API, and the component says so if that lookup fails rather than reporting zero lights.

**Signal timing.** London does not publish signal timings, so each light gets a fixed cycle drawn from typical ranges and tied to its identity, so the same light behaves the same way on every ride:

| | Quiet | Typical | Rush hour |
|---|---|---|---|
| Junction cycle | 56–80 s | 64–96 s | 80–120 s |
| Green for your approach | 30–55% of the cycle | | |
| Crossing called every | 150–240 s | 70–110 s | 45–75 s |
| Traffic held per call | 16–24 s | | |

Lights follow the UK sequence (green, amber, red, red and amber). What varies from ride to ride is the moment you set off.

**Rider.** Accelerates to a cruising speed, slows for corners according to how sharp they are, walks at 5 km/h where the router says to dismount, brakes for anything that is not green, and takes about a second to pull away when it changes. The rider never jumps a red.

**Cost of the lights.** Each ride is compared with a twin ride on the same route with every light green. The difference is the time the lights added, which includes braking and pulling away as well as standing still. The cost is the difference between the two fares.

**Fare.** Unlock fee plus the per-minute rate for every started minute, as Lime's help centre describes. Because of the rounding, a delay only costs money when it pushes the ride into another minute, so one ride can lose 45 seconds for free and the next can lose 20 seconds and pay 33p. The forecast averages this out.

### What it does not model

Queues of traffic, hills, zebra crossings and give-way junctions, linked signals that give a run of greens, the time taken to unlock and park, and riders who jump reds. Signal timings are plausible, not measured.

### Prices

Prices live in `src/engine/pricing.ts` with the date they were checked (autumn 2026). They change often.

## Development

```bash
npm install
npm run dev          # dev page; add ?fixed to the URL for a fixed-route embed
npm test             # engine tests
npm run build        # library bundle and type declarations in dist/
```

### Refreshing the traffic-light data

```bash
curl -LO https://download.geofabrik.de/europe/united-kingdom/england/greater-london-latest.osm.pbf
curl -LO https://download.geofabrik.de/europe/united-kingdom/england/greater-london.poly
npm run build-signals -- greater-london-latest.osm.pbf greater-london.poly
```

### Releasing

`dist/` is not committed on source branches. Built packages live on the `release` branch, one commit and one tag per version, and that is what `github:MattieTK/lime-bike-sim#v2.0.0` installs.

```bash
# bump "version" in package.json and commit, then:
npm run release
git push origin release v2.1.0
```

`npm run release` builds the library and commits `dist/`, the README and a `package.json` without scripts or devDependencies to the `release` branch. The scripts are left out on purpose: npm installs every devDependency of a git dependency that has a `build` script.

### Demo site

`demo/` is a small Vite app that mounts the component full-page and deploys to Cloudflare Workers:

```bash
cd demo
npm install
cf deploy
```

### Using the model without the map

```ts
import { buildPlan, createContext, runForecast } from 'lime-bike-simulator';

const plan = await buildPlan({ lat: 51.5007, lng: -0.1246 }, { lat: 51.5155, lng: -0.1419 });
const forecast = runForecast(createContext(plan, 'typical'), 'typical', 'payg', {
  unlockFee: 1,
  perMinuteRate: 0.33,
});
console.log(forecast.meanExtra); // average cost of red lights, GBP
```

## Data sources

- **Map and traffic lights**: © OpenStreetMap contributors (ODbL)
- **Routing**: OSRM bicycle profile, hosted by FOSSGIS
- **Place search**: Photon, hosted by Komoot

Not affiliated with Lime.

## License

MIT
