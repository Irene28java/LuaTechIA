import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    // Evita warnings por chunks grandes
    chunkSizeWarningLimit: 2000,

    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          libs: [
            'framer-motion',
            'socket.io-client',
            'zustand',
            '@stripe/stripe-js',
            '@stripe/react-stripe-js'
          ]
        }
      }
    }
  },

  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],

      manifest: {
        name: 'LúaTechIA',
        short_name: 'LúaTechIA',
        description: 'Asistente educativa inteligente para estudiantes y profesores',
        theme_color: '#344759',
        background_color: '#ffffff',
        display: 'standalone',

        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],

  resolve: {
    preserveSymlinks: true
  }
});
