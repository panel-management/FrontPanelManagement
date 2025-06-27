import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    devtools: {enabled: true},
    css: ['~/assets/css/main.css'],
    modules: ['@nuxt/ui'],
    vite: {
        plugins: [
            tailwindcss(),
        ],
    },
    ui: {
        fonts: false,
        colorMode: false
    },
    app: {
        head: {
            charset: "utf-8",
            viewport: "width=device-width, initial-scale=1",
            meta: [{"http-equiv": "X-UA-Compatible", content: "IE=edge"}],
            htmlAttrs: {
                dir: "rtl",
                lang: "fa",
                translate: "no"
            },
        }
    },
})
