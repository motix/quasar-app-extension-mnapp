import { fileURLToPath, URL } from 'url'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'
// Main
import { defineConfig, UserConfig } from 'vite'

// https://vitejs.dev/config/
const config: UserConfig = {
  define: {
    'process.env': {
      NODE_ENV: process.env.NODE_ENV,
      DEV: true,
      DEBUGGING: true,
      SERVER: false,
      VUE_ROUTER_BASE: '/'
    },
    // Avoid `module is not defined` error in store HMR feature
    module: {}
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

// <% if (config.hasModule('map-paths')) { %>Start mnapp.map-paths module
import { defineConfig as mapPaths } from '.mnapp-vite/map-paths'
mapPaths(config)
// End<% } else { %>No<% } %> mnapp.map-paths module

// <% if (config.hasModule('firebase')) { %>Start mnapp.firebase module
import { defineConfig as firebase } from '.mnapp-vite/firebase'
firebase(config)
// End<% } else { %>No<% } %> mnapp.firebase module

// <% if (config.hasModule('app-default')) { %>Start mnapp.app-default module
import { defineConfig as appDefault } from '.mnapp-vite/app-default'
appDefault(config)
// End<% } else { %>No<% } %> mnapp.app-default module

export default defineConfig(config)
