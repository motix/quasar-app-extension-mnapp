import { fileURLToPath, URL } from 'url'

import type { UserConfig } from 'vite'

export function defineConfig (config: UserConfig) {
  config.resolve?.alias && (config.resolve.alias = {
    ...config.resolve.alias,

    // App-defined webpack aliases
    models: fileURLToPath(new URL('../src/models', import.meta.url)),
    api: fileURLToPath(new URL('../src/api', import.meta.url)),
    services: fileURLToPath(new URL('../src/services', import.meta.url)),
    stores: fileURLToPath(new URL('../src/stores', import.meta.url)),
    composables: fileURLToPath(new URL('../src/composables', import.meta.url)),
    mixins: fileURLToPath(new URL('../src/mixins', import.meta.url)),
    utils: fileURLToPath(new URL('../src/utils', import.meta.url))
  })
}
