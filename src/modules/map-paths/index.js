const path = require('path')

module.exports = function (api) {
  // Aliases that match tsconfig.json
  api.extendWebpack((cfg) => {
    cfg.resolve.alias = {
      ...cfg.resolve.alias,
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
}
