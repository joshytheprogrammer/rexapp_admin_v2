// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [],
  runtimeConfig: {
    public: {
      baseURL: process.env.BASE_URL || 'https://api.rexapp.com/api',
    },
  },
  modules: [
    "@vuestic/nuxt",
    '@nuxtjs/tailwindcss', 
    '@pinia/nuxt'
  ]
})
