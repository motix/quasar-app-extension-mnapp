module.exports = function (api) {
  api.extendQuasarConf((conf) => {
    conf.boot.push(
      'scroll'
    )
  })

  if (api.appDir.endsWith('\\dev')) {
    api.extendQuasarConf((conf) => {
      conf.boot.push(
        'scroll-dev'
      )
    })
  }
}
