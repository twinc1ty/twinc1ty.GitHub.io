export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
  ],

  tailwindcss: {
    configPath: '~/tailwind.config.ts',
  },

  googleFonts: {
    families: {
      'Orbitron': [400, 500, 600, 700, 800, 900],
      'Space Mono': [400, 700],
      'Space Grotesk': [300, 400, 500, 600, 700],
      'Inter': [400, 500, 600, 700],
    },
    display: 'swap',
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'tokyo-night',
        },
      },
    },
  },

  app: {
    head: {
      title: 'twinc1ty | Portfolio',
      meta: [
        { name: 'description', content: 'Senior Software Engineer - Portfolio' },
        { name: 'theme-color', content: '#0c0c10' },
      ],
      htmlAttrs: {
        lang: 'en',
      },
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  nitro: {
    preset: 'github-pages',
  },

  compatibilityDate: '2025-01-01',
})
