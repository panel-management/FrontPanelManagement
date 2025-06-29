import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
    compatibilityDate: '2025-05-15',
    devtools: {enabled: true},
    modules: ['@nuxt/ui'],
    css: ['~/assets/css/main.css'],
    vite: {
        plugins: [
            tailwindcss(),
        ],
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
            link: [
                {rel: "preconnect", href: "https://fonts.googleapis.com"},
                {rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: ""},
                {rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@500&display=swap"},
            ]
        },
    },
    ui: {
        fonts: false,
        colorMode: false
    },
})
