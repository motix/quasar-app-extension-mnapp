const path = require('path')

module.exports = function (api) {
  // Aliases that match tsconfig.json
  api.extendWebpack((cfg) => {
    cfg.resolve.alias = {
      ...cfg.resolve.alias,
      models: path.resolve(api.appDir, './src/models'),
      api: path.resolve(api.appDir, './src/api'),
      store: path.resolve(api.appDir, './src/store'),
      composables: path.resolve(api.appDir, './src/composables'),
      mixins: path.resolve(api.appDir, './src/mixins'),
      utils: path.resolve(api.appDir, './src/utils')
    }
  })
}
