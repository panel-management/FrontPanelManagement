import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: process.env.APP_DEBUG?.toLocaleLowerCase() === "true" },
  modules: ["@nuxt/ui", "@pinia/nuxt", "@vueuse/nuxt"],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [{ "http-equiv": "X-UA-Compatible", content: "IE=edge" }],
      htmlAttrs: {
        dir: "rtl",
        lang: "fa",
        translate: "no",
      },
    },
  },
  ui: {
    fonts: false,
    colorMode: false,
    theme: {
      colors: [
        "primary",
        "secondary",
        "tertiary",
        "info",
        "success",
        "warning",
        "error",
      ],
    },
  },
  runtimeConfig: {
    public: {
      APP_NAME: process.env.APP_NAME,
      APP_ENV: process.env.APP_ENV,
      APP_URL: process.env.APP_URL ?? "http://localhost:3000",
      API_URL: process.env.API_URL,
      PAYMENT_NAME: process.env.NUXT_PAYMENT_NAME,
      PAYMENT_CARD: process.env.NUXT_PAYMENT_CARD,
      PAYMENT_SHABA: process.env.NUXT_PAYMENT_SHABA,
    },
  },
});
