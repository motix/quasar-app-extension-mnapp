/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = function (api) {
  api.extendQuasarConf((conf, api) => {
    conf.devServer.port = api.prompts.devServerPort
    conf.build.vueRouterMode = 'history'
    conf.boot.push(
      'notify'
    )
  })
}
