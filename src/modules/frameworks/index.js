module.exports = function (api) {
  api.extendQuasarConf((conf) => {
    conf.framework.plugins.push(
      'Meta',
      'Notify',
      'Dialog'
    )
  })
}
