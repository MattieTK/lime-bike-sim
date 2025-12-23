# Lime Bike Simulator

An interactive React component that simulates Lime bike rides in London, showing real-time route playback with cost calculations and traffic light wait time analysis.

## Features

- Interactive map of London using Leaflet + OpenStreetMap
- Real cycling routes from OSRM routing API
- Automatic traffic light detection along routes via Overpass API
- Realistic bike physics: 15 mph max speed with acceleration/braking
- Live cost calculation with Lime's pricing model
- Comparison between ideal ride cost and actual cost (with traffic light waits)
- Animated bike icon moving along the route
- Configurable via props

## Installation

```bash
npm install lime-bike-simulator
```

## Usage in Astro

```astro
---
import { LimeBikeSimulator } from 'lime-bike-simulator';
import 'lime-bike-simulator/style.css';
---

<LimeBikeSimulator
  client:load
  startLocation={{ lat: 51.5007, lng: -0.1246, label: "Big Ben" }}
  endLocation={{ lat: 51.5155, lng: -0.1419, label: "Oxford Circus" }}
  unlockFee={1}
  perMinuteRate={0.20}
  simulationSpeed={15}
  height={600}
/>
```

## Usage in React

```tsx
import { LimeBikeSimulator } from 'lime-bike-simulator';
import 'lime-bike-simulator/style.css';

function App() {
  return (
    <LimeBikeSimulator
      startLocation={{ lat: 51.5007, lng: -0.1246, label: "Big Ben" }}
      endLocation={{ lat: 51.5155, lng: -0.1419, label: "Oxford Circus" }}
      unlockFee={1}
      perMinuteRate={0.20}
      simulationSpeed={15}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `startLocation` | `Location` | - | Starting point with lat, lng, and optional label |
| `endLocation` | `Location` | - | Destination with lat, lng, and optional label |
| `unlockFee` | `number` | `1.00` | Unlock fee in GBP |
| `perMinuteRate` | `number` | `0.20` | Per-minute rate in GBP |
| `simulationSpeed` | `number` | `10` | Simulation speed multiplier (e.g., 10 = 10x real-time) |
| `minWaitTime` | `number` | `15` | Minimum traffic light wait time in seconds |
| `maxWaitTime` | `number` | `90` | Maximum traffic light wait time in seconds |
| `width` | `string \| number` | `'100%'` | Component width |
| `height` | `string \| number` | `600` | Component height |
| `showControls` | `boolean` | `true` | Show play/pause/reset controls |
| `allowLocationPicker` | `boolean` | `true` | Allow clicking map to set locations (when not provided via props) |

### Location Type

```typescript
interface Location {
  lat: number;
  lng: number;
  label?: string;
}
```

## Bike Physics

The simulator models realistic Lime bike physics:

- **Maximum speed**: 15 mph (24 km/h)
- **Acceleration time**: 5 seconds to reach max speed
- **Braking time**: 3 seconds to stop
- **Traffic light waits**: Random duration between minWaitTime and maxWaitTime

## How Cost is Calculated

```
Total Cost = Unlock Fee + (Total Minutes × Per-Minute Rate)

Wasted Money = (Time Waiting at Lights) × Per-Minute Rate
```

The component shows both the actual cost and an "ideal cost" (what the ride would cost without any traffic light stops) so riders can see exactly how much money they're losing to traffic infrastructure.

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

## Data Sources

- **Mapping**: OpenStreetMap via Leaflet
- **Routing**: OSRM Demo Server (bike routing)
- **Traffic Lights**: Overpass API (OpenStreetMap data)

## License

MIT
