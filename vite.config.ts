import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import path from 'path';

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    ViteImageOptimizer({
      // Process images in public/ directory (served as static assets)
      includePublic: true,
      // Compress PNG/JPEG at build time for reduced payload
      png: { quality: 80 },
      jpeg: { quality: 80 },
      jpg: { quality: 80 },
      // WebP/AVIF compression settings for any images already in modern formats
      webp: { quality: 80 },
      avif: { quality: 65 },
      // Log optimization stats during build
      logStats: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          gsap: ['gsap'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
});
