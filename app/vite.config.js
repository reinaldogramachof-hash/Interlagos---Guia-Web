import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { createReadStream } from 'fs'
import { stat } from 'fs/promises'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const landingDir = path.resolve(__dirname, '../landing')

// Plugin que serve a pasta landing/ em / durante o dev server
// Espelha o comportamento de produção: / = landing, /{bairro}/ = app
function serveLandingPlugin(appBase) {
  return {
    name: 'serve-landing',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = (req.url || '/').split('?')[0]
        if (url.startsWith(appBase) || url.startsWith('/@') || url.startsWith('/node_modules')) {
          return next()
        }
        const filePath = path.join(landingDir, url === '/' ? 'index.html' : url)
        try {
          const info = await stat(filePath)
          if (info.isFile()) {
            const ext = path.extname(filePath).toLowerCase()
            const mime = {
              '.html': 'text/html; charset=utf-8',
              '.css':  'text/css',
              '.js':   'application/javascript',
              '.png':  'image/png',
              '.jpg':  'image/jpeg',
              '.jpeg': 'image/jpeg',
              '.svg':  'image/svg+xml',
              '.ico':  'image/x-icon',
              '.webp': 'image/webp',
            }
            res.setHeader('Content-Type', mime[ext] || 'application/octet-stream')
            createReadStream(filePath).pipe(res)
            return
          }
        } catch { /* arquivo não existe, passa para o próximo handler */ }
        next()
      })
    },
  }
}

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
      serveLandingPlugin(basePath),
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
          // [Bug#2 - mitigação] skipWaiting garante que o novo SW não fica em waiting,
          // evitando que duas versões concorrentes interceptem o redirect do OAuth.
          skipWaiting: true,
          clientsClaim: true,
          // NetworkFirst para API Supabase: tenta rede, cai no cache se offline
          runtimeCaching: [
            {
              urlPattern: ({ url }) => url.hostname.includes('supabase.co'),
              handler: 'NetworkFirst',
              options: {
                cacheName: 'supabase-api',
                expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 }, // 24h
                // [Bug#2] Timeout alinhado com _fetchProfile (8s) para evitar
                // que respostas lentas caiam em cache stale durante o OAuth redirect.
                networkTimeoutSeconds: 8,
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
          // [Bug#2] Denylista de rotas com hash fragment OAuth (#access_token=...).
          // O SW não deve interferir com a URL de callback do provider.
          navigateFallbackDenylist: [/^\/api\//, /#access_token=/],
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
