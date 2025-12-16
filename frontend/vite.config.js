import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    // Aumenta el límite de chunks para que no salgan advertencias amarillas
    chunkSizeWarningLimit: 2000, // en KB
    rollupOptions: {
      output: {
        // Separar librerías grandes en chunks independientes
        manualChunks: {
          react: ['react', 'react-dom'],
          libs: ['framer-motion', 'socket.io-client', 'zustand', '@stripe/stripe-js', '@stripe/react-stripe-js']
        }
      }
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/icon-180.png'],
      manifest: {
        name: 'LúaTechIA',
        short_name: 'LúaTechIA',
        description: 'Asistente educativa inteligente para estudiantes y profesores',
        theme_color: '#344759ff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-180.png', sizes: '180x180', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ],
  resolve: {
    // Asegura que los imports respeten mayúsculas
    preserveSymlinks: true
  }
});
