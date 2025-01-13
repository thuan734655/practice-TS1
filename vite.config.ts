import { defineConfig } from 'vite'
import { resolve } from 'path';
import svgr from 'vite-plugin-svgr';
export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3001,
    open: true,
  },
  plugins: [svgr()],
})
