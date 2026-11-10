import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { cloudflare } from '@cloudflare/vite-plugin';

export default defineConfig({
  plugins: [react(), cloudflare()],
  // The component source lives one folder up; make sure it shares this app's React.
  resolve: { dedupe: ['react', 'react-dom', 'leaflet'] },
});
