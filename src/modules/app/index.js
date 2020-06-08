/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')

module.exports = function (api) {
  // Aliases that match tsconfig.json
  api.extendWebpack((cfg) => {
    cfg.resolve.alias = {
      ...cfg.resolve.alias,
      store: path.resolve(__dirname, './src/store'),
      api: path.resolve(__dirname, './src/api'),
      utils: path.resolve(__dirname, './src/utils'),
      mixins: path.resolve(__dirname, './src/mixins'),
      uses: path.resolve(__dirname, './src/uses')
    }
  })

  api.extendQuasarConf((conf, api) => {
    conf.devServer.port = api.prompts.devServerPort
    conf.build.vueRouterMode = 'history'
    conf.framework.iconSet = 'fontawesome-v5-pro'
    conf.framework.plugins.push(
      'Notify',
      'Dialog'
    )
    conf.boot.push(
      'notify',
      'fontawesome-pro',
      'axios',
      'lodash',
      'vuelidate',
      'vue-json-tree-view',
      'app',
      'formats'
    )
  })
}
