import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: {
    enabled: import.meta.env.APP_DEBUG?.toLocaleLowerCase() === 'true',
  },
  ssr: false,
  modules: ['@nuxt/ui', '@pinia/nuxt', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],
  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: 'terser',
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
      link: [
        {
          rel: 'preload',
          href: '~/assets/fonts/Vazirmatn-Medium.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
      ],
    },
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
