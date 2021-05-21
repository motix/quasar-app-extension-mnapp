module.exports = function (api) {
  api.extendQuasarConf((conf) => {
    conf.boot.push(
      'shared-components'
    )
  })

  if (api.appDir.endsWith('\\dev')) {
    api.extendQuasarConf((conf) => {
      conf.boot.push(
        'shared-components-dev'
      )
    })
  }
}
