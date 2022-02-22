import { fileURLToPath, URL } from 'url'
import { defineConfig, UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// https://vitejs.dev/config/
const config: UserConfig = {
  define: {
    'process.env': {}
  },
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),
    quasar({
      sassVariables: 'src/css/quasar.variables.scss'
    })
  ],
  resolve: {
    alias: {
      // Quasar-defined webpack aliases
      src: fileURLToPath(new URL('./src', import.meta.url)),
      app: fileURLToPath(new URL('.', import.meta.url)),
      components: fileURLToPath(new URL('./src/components', import.meta.url)),
      layouts: fileURLToPath(new URL('./src/layouts', import.meta.url)),
      pages: fileURLToPath(new URL('./src/pages', import.meta.url)),
      assets: fileURLToPath(new URL('./src/assets', import.meta.url)),
      boot: fileURLToPath(new URL('./src/boot', import.meta.url))
    }
  },
  optimizeDeps: {
    include: ['quasar/wrappers']
  }
}

// Start mnapp.map-paths module
import { defineConfig as mapPaths } from '.mnapp-vite/map-paths'
mapPaths(config)
// End mnapp.map-paths module

// Start mnapp.firebase module
import { defineConfig as firebase } from '.mnapp-vite/firebase'
firebase(config)
// End mnapp.firebase module

// Start mnapp.app-default module
import { defineConfig as appDefault } from '.mnapp-vite/app-default'
appDefault(config)
// End mnapp.app-default module

export default defineConfig(config)
