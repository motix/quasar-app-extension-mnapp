module.exports = function (api) {
  api.removePath('src/boot/notify.ts')

  api.onExitLog('Please revert ./src/css/app.scss and ./src/css/quasar.variables.scss to original content.')
}
