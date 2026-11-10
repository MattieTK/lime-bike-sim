import { defineConfig } from "vitest/config";
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Type declarations are emitted by `tsc -p tsconfig.build.json` (see package.json).
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: {
        'lime-bike-simulator': resolve(__dirname, 'src/index.ts'),
        'ssr-safe': resolve(__dirname, 'src/ssr-safe.tsx'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        exports: 'named',
        assetFileNames: (assetInfo) =>
          assetInfo.names?.some((n) => n.endsWith('.css')) ? 'style.css' : '[name][extname]',
      },
    },
    cssCodeSplit: false,
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
});
