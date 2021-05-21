module.exports = function (api) {
  api.extendQuasarConf((conf) => {
    conf.framework.iconSet = 'fontawesome-v5-pro'
    conf.boot.push(
      'fontawesome-pro'
    )
  })
}
