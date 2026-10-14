export default defineNuxtConfig({
  compatibilityDate: '2026-10-14',
  devtools: { enabled: false },
  ssr: true,
  css: ['revacss/dist/reva.css'],
  build: { transpile: ['@revacss/vue'] },
  nitro: { preset: 'node-server' }
});
