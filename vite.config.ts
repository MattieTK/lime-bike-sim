import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      include: ['src'],
    }),
  ],
  build: {
    lib: {
      entry: {
        'lime-bike-simulator': resolve(__dirname, 'src/index.ts'),
        'ssr-safe': resolve(__dirname, 'src/ssr-safe.tsx'),
      },
      name: 'LimeBikeSimulator',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        exports: 'named',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'style.css';
          return assetInfo.name || 'asset';
        },
        // Ensure chunks are inlined into the ssr-safe bundle
        inlineDynamicImports: false,
      },
    },
    cssCodeSplit: false,
  },
});