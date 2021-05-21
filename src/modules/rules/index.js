module.exports = function (api) {
  if (api.appDir.endsWith('\\dev')) {
    api.extendQuasarConf((conf) => {
      conf.boot.push(
        'rules-dev'
      )
    })
  }
}
