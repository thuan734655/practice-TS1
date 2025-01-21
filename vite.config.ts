import { defineConfig } from 'vite';
import { resolve } from 'path';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: parseInt(process.env.PORT || '3000'),
    host: '0.0.0.0',
    open: false,
  },
  plugins: [svgr()],
});
