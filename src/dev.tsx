import React from 'react';
import ReactDOM from 'react-dom/client';
import { LimeBikeSimulator } from './LimeBikeSimulator';

// Dev page. Add ?fixed to the URL to see the component with a route passed in
// as props, the way a blog post would embed it.
const fixed = new URLSearchParams(window.location.search).has('fixed');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {fixed ? (
      <LimeBikeSimulator
        startLocation={{ lat: 51.5007, lng: -0.1246, label: 'Big Ben' }}
        endLocation={{ lat: 51.5155, lng: -0.1419, label: 'Oxford Circus' }}
        height={640}
      />
    ) : (
      <LimeBikeSimulator height={640} />
    )}
  </React.StrictMode>
);
