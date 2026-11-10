# Lime Bike Simulator

An interactive React component that simulates Lime bike rides, analyzing how per-minute pricing generates revenue from traffic stops.

## Features

- Interactive map using Leaflet + OpenStreetMap
- Real cycling routes from OSRM routing API
- Automatic traffic light detection along routes via Overpass API
- Realistic bike physics: 15 mph max speed with acceleration/braking
- Live cost calculation with Lime's per-minute pricing model
- **Pricing model comparison**: Per-minute vs per-distance vs motion-only
- **Live revenue counter**: Shows earnings accumulating while stopped
- **Social sharing**: Share your ride data on Twitter/LinkedIn
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

## Traffic Light Simulation

Traffic lights use realistic timing cycles:

- **Cycle duration**: 60-120 seconds per light
- **Phase distribution**: ~45% red, ~50% green, ~5% yellow
- **Random phase offset**: Each light starts at a different point in its cycle
- **Visual feedback**: Upcoming lights show their current phase (red/yellow/green)
- **Green lights**: Cyclist passes through without stopping
- **Red/yellow lights**: Cyclist waits until green

## How Cost is Calculated

```
Total Cost = Unlock Fee + (Total Minutes × Per-Minute Rate)

Stop-Time Revenue = (Time Stopped at Lights) × Per-Minute Rate
```

The component compares three pricing models:

| Model | Calculation |
|-------|-------------|
| **Per-minute (current)** | Unlock + (total time × £0.20/min) |
| **Per-distance** | Unlock + (distance × £0.15/km) |
| **Motion-only** | Unlock + (moving time × £0.20/min) |

This shows how much revenue is generated specifically from time spent stopped at traffic lights - time when the rider has no choice but to wait.

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
