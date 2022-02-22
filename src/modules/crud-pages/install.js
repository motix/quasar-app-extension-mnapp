module.exports = function (api) {
  api.render('./templates/dist')

  if (api.appDir.endsWith('\\dev')) {
    api.render('./templates/dev')
  }

  api.onExitLog('\x1b[32mcrud-pages    • \x1b[0mPlease provide \x1b[47m\x1b[30m./src/composables/use-mapper.ts\x1b[0m.')
}
