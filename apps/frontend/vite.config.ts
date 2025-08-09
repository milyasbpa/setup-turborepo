import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

/* eslint-env node */

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: env.VITE_SW_REGISTER_TYPE as 'prompt' | 'autoUpdate' || 'prompt',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          cleanupOutdatedCaches: true,
          skipWaiting: env.VITE_SW_REGISTER_TYPE === 'autoUpdate',
        },
        devOptions: {
          enabled: env.VITE_PWA_DEV_ENABLED === 'true' || command === 'serve',
          type: 'module',
        },
        manifest: {
          name: env.VITE_APP_NAME || 'Turborepo Frontend App',
          short_name: env.VITE_APP_SHORT_NAME || 'TurboApp',
          description: env.VITE_APP_DESCRIPTION || 'A modern React application with PWA capabilities',
          theme_color: env.VITE_PWA_THEME_COLOR || '#61dafb',
          background_color: env.VITE_PWA_BACKGROUND_COLOR || '#282c34',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          orientation: 'portrait-primary',
          icons: [
            {
              src: 'pwa-64x64.png',
              sizes: '64x64',
              type: 'image/png'
            },
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: 'maskable-icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable'
            }
          ],
          categories: ['productivity', 'utilities', 'education'],
          screenshots: [
            {
              src: 'screenshot-wide.png',
              sizes: '1280x720',
              type: 'image/png',
              form_factor: 'wide'
            },
            {
              src: 'screenshot-narrow.png',
              sizes: '750x1334',
              type: 'image/png',
              form_factor: 'narrow'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@/core': fileURLToPath(new URL('./src/core', import.meta.url)),
        '@/features': fileURLToPath(new URL('./src/features', import.meta.url)),
        '@/components': fileURLToPath(new URL('./src/components', import.meta.url)),
        '@/hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
        '@/utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
        '@/types': fileURLToPath(new URL('./src/types', import.meta.url)),
        '@/assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      }
    },
    server: {
      proxy: {
        [env.VITE_API_BASE_PATH || '/api']: {
          target: env.VITE_API_URL || 'http://localhost:3002',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: env.VITE_ENABLE_CODE_SPLITTING === 'true' ? {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            query: ['@tanstack/react-query'],
            i18n: ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
            pwa: ['workbox-window', 'vite-plugin-pwa']
          } : undefined,
          chunkFileNames: () => {
            return 'assets/[name]-[hash].js';
          }
        },
        onwarn: (warning, warn) => {
          // Suppress chunk size warnings if configured
          const chunkSizeLimit = parseInt(env.VITE_CHUNK_SIZE_WARNING_LIMIT || '500', 10);
          if (warning.code === 'BUNDLE_SIZE_EXCEEDED' && chunkSizeLimit > 1000) {
            return;
          }
          warn(warning);
        }
      }
    },
    define: {
      // Expose environment variables to the app
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    }
  }
})
