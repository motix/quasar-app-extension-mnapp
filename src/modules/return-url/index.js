module.exports = function (api) {
  api.extendQuasarConf((conf) => {
    conf.boot.push('return-url')
  })
}
