import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath, URL } from 'node:url'

/* eslint-env node */

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'prompt',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          cleanupOutdatedCaches: true,
        },
        // Disable in development for now
        disable: mode === 'development',
        manifest: {
          name: 'MathLearn - Math Learning App',
          short_name: 'MathLearn',
          description: 'A modern React application with PWA capabilities',
          theme_color: '#61dafb',
          background_color: '#282c34',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          orientation: 'portrait-primary',
          icons: [
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
    preview: {
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
        external: (id) => {
          // Externalize any modules that might cause issues
          if (id.includes('pkg') || id.includes('fsevents') || id.includes('wasm')) {
            return true
          }
          return false
        }
      }
    }
  }
})
