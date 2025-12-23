import React from 'react';
import ReactDOM from 'react-dom/client';
import { LimeBikeSimulator } from './LimeBikeSimulator';

// Demo with pre-set London locations (Big Ben to Oxford Circus)
function Demo() {
  return (
    <LimeBikeSimulator
      // Uncomment to use preset locations:
      // startLocation={{ lat: 51.5007, lng: -0.1246, label: "Big Ben" }}
      // endLocation={{ lat: 51.5155, lng: -0.1419, label: "Oxford Circus" }}
      unlockFee={1}
      perMinuteRate={0.20}
      simulationSpeed={15}
      height={700}
      showControls={true}
      allowLocationPicker={true}
    />
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Demo />
  </React.StrictMode>
);
