import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: {
    enabled: import.meta.env.APP_DEBUG?.toLocaleLowerCase() === 'true',
  },
  ssr: false,
  modules: ['@nuxt/ui', '@pinia/nuxt', '@vueuse/nuxt', '@vite-pwa/nuxt'],
  css: ['~/assets/css/main.css'],
  experimental: {
    viteEnvironmentApi: import.meta.env.APP_DEBUG?.toLocaleLowerCase() === 'true',
    noVueServer: true,
    // inlineRouteRules: true,
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
          drop_console: import.meta.env.APP_DEBUG?.toLocaleLowerCase() !== 'true',
          drop_debugger: true,
        },
      },
      sourcemap: import.meta.env.APP_DEBUG?.toLocaleLowerCase() === 'true',
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
      name: import.meta.env.APP_NAME,
      lang: 'fa',
      dir: 'rtl',
      short_name: import.meta.env.APP_NAME,
      description: 'smart panel of the sports club',
      theme_color: '#ffffff',
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
          urlPattern: new RegExp(`${import.meta.env.API_URL}/api/v1/.*`),
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
      enabled: import.meta.env.APP_DEBUG?.toLocaleLowerCase() === 'true',
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
      APP_NAME: import.meta.env.APP_NAME,
      APP_ENV: import.meta.env.APP_ENV,
      APP_URL: import.meta.env.APP_URL ?? 'http://localhost:3000',
      API_URL: import.meta.env.API_URL,
      PAYMENT_NAME: import.meta.env.NUXT_PAYMENT_NAME,
      PAYMENT_CARD: import.meta.env.NUXT_PAYMENT_CARD,
      PAYMENT_SHABA: import.meta.env.NUXT_PAYMENT_SHABA,
    },
  },
})
