// Supports quasar prepare

import { defineConfig } from '#q-app/wrappers'

export default defineConfig((/* ctx */) => {
  return {
    build: {
      typescript: {
        strict: true,
        vueShim: false,
      },
    },
  }
})
