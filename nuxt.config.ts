import tailwindcss from '@tailwindcss/vite'

const isDevelopment = process.env.NODE_ENV === 'development' ? true : false

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: isDevelopment },
  ssr: false,
  modules: ['@nuxt/ui', '@pinia/nuxt', '@vueuse/nuxt', '@vite-pwa/nuxt'],
  css: ['~/assets/css/main.css'],
  experimental: {
    viteEnvironmentApi: isDevelopment,
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
          drop_console: !isDevelopment,
          drop_debugger: true,
        },
      },
      sourcemap: isDevelopment,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  },
  pwa: {
    strategies: 'generateSW',
    registerType: 'autoUpdate',
    client: { installPrompt: true },
    manifest: {
      name: 'پنل هوشمند باشگاه',
      short_name: 'پنل باشگاه',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      start_url: '/',
      display: 'standalone',
      orientation: 'portrait',
      dir: 'rtl',
      lang: 'fa',
      icons: [
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any',
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any',
        },
      ],
    },
    workbox: {
      cleanupOutdatedCaches: true,
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      runtimeCaching: [
        {
          urlPattern: new RegExp(`${process.env.NUXT_API_URL}/api/v1/.*`),
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
    devOptions: { enabled: isDevelopment, type: 'module' },
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
  // icon: {
  //   clientBundle: {
  //     scan: true,
  //     icons: [
  //       'lucide:loader-circle',
  //       'lucide:x',
  //       'lucide:check',
  //       'lucide:chevrons-left',
  //       'lucide:chevrons-right',
  //       'lucide:chevron-left',
  //       'lucide:chevron-right',
  //       'garden:minimize-stroke-12',
  //       'garden:maximize-stroke-12',
  //       'heroicons:x-circle',
  //       'heroicons:check-circle',
  //       'proicons:question-circle',
  //       'mage:dashboard-2-fill',
  //       'material-symbols-light:warning-rounded',
  //     ],
  //   },
  //   serverBundle: false,
  // },
  ui: {
    fonts: false,
    colorMode: false,
    transitions: false,
    theme: {
      colors: ['primary', 'secondary', 'tertiary', 'info', 'success', 'warning', 'error'],
    },
  },
  runtimeConfig: {
    public: {
      API_URL: process.env.NUXT_API_URL ?? 'http://api.e4f.ir',
      PAYMENT_NAME: process.env.NUXT_PAYMENT_NAME,
      PAYMENT_CARD: process.env.NUXT_PAYMENT_CARD,
      PAYMENT_SHABA: process.env.NUXT_PAYMENT_SHABA,
    },
  },
})
