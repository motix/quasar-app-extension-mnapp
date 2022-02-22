import { readFileSync } from 'fs'
import { resolve } from 'path'
// Types
import type { UserConfig } from 'vite'

export function defineConfig (config: UserConfig) {
  if (config.define) {
    const processEnv = config.define['process.env'] as Record<string, unknown>
    processEnv.VUE_ROUTER_MODE = 'history'
  }

  config.server = {
    ...config.server,
    port: Number('<%= prompts.devServerPort + 1 %>'),
    https: {
      key: readFileSync(resolve(__dirname, '../mkcerts/server.key')),
      cert: readFileSync(resolve(__dirname, '../mkcerts/server.crt'))
    }
  }
}
