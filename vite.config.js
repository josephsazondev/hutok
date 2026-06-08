import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: process.env.PORT ? { port: Number(process.env.PORT), strictPort: false } : undefined,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  base: './',
});
