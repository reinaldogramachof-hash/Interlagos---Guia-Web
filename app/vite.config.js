import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis do .env, .env.production, etc.
  const env = loadEnv(mode, process.cwd(), '')

  // Bairro atual definido pela variável VITE_NEIGHBORHOOD (ex: interlagos, moema)
  // Usado para construir o base path: /interlagos/, /moema/, etc.
  const neighborhood = env.VITE_NEIGHBORHOOD || ''
  const basePath = neighborhood ? `/${neighborhood}/` : '/'

  return {
    base: basePath,
    plugins: [
      react(),
      VitePWA({
        disabled: env.VITE_DISABLE_PWA === 'true',
        registerType: 'autoUpdate',
        devOptions: { enabled: false },
        includeAssets: ['capa.jpg', 'logoIC.png'],
        manifest: {
          name: 'Tem No Bairro',
          short_name: 'Tem No Bairro',
          description: 'O guia digital oficial do seu bairro. Encontre comércios, serviços e novidades.',
          theme_color: '#4338ca',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: basePath,
          scope: basePath,
          icons: [
            { src: `${basePath}pwa-192x192.png`, sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: `${basePath}pwa-192x192.png`, sizes: '192x192', type: 'image/png', purpose: 'maskable' },
            { src: `${basePath}pwa-512x512.png`, sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: `${basePath}pwa-512x512.png`, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          // NetworkFirst para API Supabase: tenta rede, cai no cache se offline
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.hostname.includes('supabase.co'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'supabase-api',
                expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 }, // 24h
                networkTimeoutSeconds: 5,
              },
            },
            // CacheFirst para imagens estáticas e Unsplash
            {
              urlPattern: ({ request }) => request.destination === 'image',
              handler: 'CacheFirst',
              options: {
                cacheName: 'images',
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 }, // 7 dias
              },
            },
            // StaleWhileRevalidate para fontes e assets de CDN
            {
              urlPattern: ({ url }) =>
                url.hostname === 'fonts.googleapis.com' ||
                url.hostname === 'fonts.gstatic.com',
              handler: 'StaleWhileRevalidate',
              options: { cacheName: 'google-fonts' },
            },
          ],
          // Garante que o SW controle todas as rotas (SPA)
          navigateFallback: `${basePath}index.html`,
          navigateFallbackDenylist: [/^\/api\//],
          // Aumenta o limite de assets pré-cacheados para o SPA
          maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3 MB
        },
      }),
    ],
    // Code-splitting: separa vendor do código da app
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            supabase: ['@supabase/supabase-js'],
            ui: ['lucide-react'],
          },
        },
      },
    },
  }
})
