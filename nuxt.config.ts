import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: {
    enabled: process.env.APP_DEBUG?.toLocaleLowerCase() === 'true',
  },
  ssr: false,
  modules: ['@nuxt/ui', '@pinia/nuxt', '@vueuse/nuxt', '@vite-pwa/nuxt'],
  css: ['~/assets/css/main.css'],
  experimental: {
    viteEnvironmentApi: process.env.APP_DEBUG?.toLocaleLowerCase() === 'true',
    noVueServer: true,
  },
  features: {
    inlineStyles: true,
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: 'terser',
      cssMinify: true,
      terserOptions: {
        compress: {
          drop_console: process.env.APP_DEBUG?.toLocaleLowerCase() !== 'true',
          drop_debugger: true,
        },
      },
      sourcemap: process.env.APP_DEBUG?.toLocaleLowerCase() === 'true',
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: process.env.APP_NAME || 'پنل هوشمند باشگاه',
      short_name: process.env.APP_NAME || 'پنل هوشمند باشگاه',
      description: 'panel of the sports club',
      theme_color: '#ffffff',
      lang: 'fa',
      dir: 'rtl',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    workbox: {
      navigateFallback: '/',
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: new RegExp(`${process.env.API_URL}/api/v1/.*`),
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 3 * 60,
            },
          },
        },
      ],
    },
    devOptions: {
      enabled: process.env.APP_DEBUG?.toLocaleLowerCase() === 'true',
    },
  },
  app: {
    baseURL: '/',
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'robots', content: 'noindex, nofollow' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
      ],
      htmlAttrs: {
        dir: 'rtl',
        lang: 'fa',
        translate: 'no',
      },
    },
  },
  icon: {
    clientBundle: {
      scan: true,
      icons: [
        'lucide:loader-circle',
        'lucide:x',
        'lucide:check',
        'lucide:chevrons-left',
        'lucide:chevrons-right',
        'lucide:chevron-left',
        'lucide:chevron-right',
        'garden:minimize-stroke-12',
        'garden:maximize-stroke-12',
        'heroicons:x-circle',
        'heroicons:check-circle',
        'proicons:question-circle',
        'mage:dashboard-2-fill',
        'material-symbols-light:warning-rounded',
      ],
    },
    serverBundle: false,
  },
  ui: {
    fonts: false,
    colorMode: false,
    theme: {
      colors: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error'],
    },
  },
  runtimeConfig: {
    public: {
      APP_NAME: process.env.APP_NAME,
      APP_ENV: process.env.APP_ENV,
      APP_URL: process.env.APP_URL ?? 'http://localhost:3000',
      API_URL: process.env.API_URL,
      PAYMENT_NAME: process.env.NUXT_PAYMENT_NAME,
      PAYMENT_CARD: process.env.NUXT_PAYMENT_CARD,
      PAYMENT_SHABA: process.env.NUXT_PAYMENT_SHABA,
    },
  },
})
