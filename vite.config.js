import { defineConfig } from 'vite';

// base: './' sayesinde site GitHub Pages'te /repo-adi/ alt yolunda da çalışır.
export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
  },
  server: {
    host: true,
  },
});
