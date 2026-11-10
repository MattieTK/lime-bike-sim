import React from 'react';
import ReactDOM from 'react-dom/client';
import { LimeBikeSimulator } from '../../src/LimeBikeSimulator';
import './demo.css';

// The public demo: the component filling the page, with the route picker on.
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <main className="demo">
      <LimeBikeSimulator height="min(760px, calc(100vh - 48px))" />
      <p className="credit">
        A model, not a measurement. Route data © OpenStreetMap contributors. Not affiliated with Lime.
      </p>
    </main>
  </React.StrictMode>
);
