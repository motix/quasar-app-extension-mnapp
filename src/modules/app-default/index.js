/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs')
const getExtensionConfig = require('../extension-config')

module.exports = function (api) {
  const config = getExtensionConfig()
  const prompts = config.prompts('app-default')

  api.extendQuasarConf((conf, api) => {
    conf.devServer.https = {
      key: fs.readFileSync(api.resolve.app('mkcerts/server.key')),
      cert: fs.readFileSync(api.resolve.app('mkcerts/server.crt'))
    }
    conf.devServer.port = prompts.devServerPort
    conf.build.vueRouterMode = 'history'
    conf.boot.push('notify')
    conf.css.push('app-default.scss')
  })
}
