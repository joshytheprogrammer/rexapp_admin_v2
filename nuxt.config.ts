// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [],
  ssr: false,
  runtimeConfig: {
    public: {
      baseURL: '',
    },
  },
  modules: [
    "@vuestic/nuxt",
    '@nuxtjs/tailwindcss', 
    '@pinia/nuxt'
  ]
})
