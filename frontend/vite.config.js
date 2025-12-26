VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'icons/logo_1.png'],
  manifest: {
    name: 'LúaTechIA',
    short_name: 'LúaTechIA',
    description: 'Asistente educativa inteligente para estudiantes y profesores',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#8B5CF6',
    lang: 'es',
    icons: [
      { src: '/icons/logo_1.png', sizes: '180x180', type: 'image/png' },
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
    ]
  }
})
