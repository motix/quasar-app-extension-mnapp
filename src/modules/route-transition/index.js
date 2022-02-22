module.exports = function (api) {
  api.extendQuasarConf((conf) => {
    conf.boot.push('route-transition')
    conf.animations.push(
      'slideInLeft',
      'slideInRight',
      'slideOutLeft',
      'slideOutRight'
    )
  })
}
