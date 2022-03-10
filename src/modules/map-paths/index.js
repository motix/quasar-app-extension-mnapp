/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')
const { defineIndex } = require('..')

module.exports = defineIndex(function (api) {
  // Aliases that match tsconfig.json
  api.extendWebpack(conf => {
    conf.resolve.alias = {
      ...conf.resolve.alias,
      models: path.resolve(api.appDir, './src/models'),
      api: path.resolve(api.appDir, './src/api'),
      store: path.resolve(api.appDir, './src/store'),
      stores: path.resolve(api.appDir, './src/stores'),
      composables: path.resolve(api.appDir, './src/composables'),
      mixins: path.resolve(api.appDir, './src/mixins'),
      services: path.resolve(api.appDir, './src/services'),
      utils: path.resolve(api.appDir, './src/utils')
    }
  })
})
