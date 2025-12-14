import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
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
          { 
            src: '/icons/icon-192.png', 
            sizes: '192x192', 
            type: 'image/png' 
          },
          { 
            src: '/icons/icon-180.png', 
            sizes: '180x180', 
            type: 'image/png' 
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
  
  
});
