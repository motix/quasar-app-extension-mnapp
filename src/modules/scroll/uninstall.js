module.exports = function (api) {
  api.removePath('src/boot/scroll.ts')
  api.removePath('src/composables/use-scroll.ts')

  if (api.appDir.endsWith('\\dev')) {
    api.removePath('src/boot/scroll-dev.ts')
    api.removePath('src/pages/Scroll.vue')
  }
}
