module.exports = function (api) {
  api.removePath('src/boot/crud-pages.ts')
  api.removePath('src/components/shared/crud-pages')
  api.removePath('src/composables/crud-pages')

  api.onExitLog('\x1b[32mcrud-pages    • \x1b[0mPlease remove \x1b[47m\x1b[30m./src/composables/use-mapper.ts\x1b[0m if no longer used.')
}
