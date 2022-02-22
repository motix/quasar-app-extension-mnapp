module.exports = function (api) {
  api.removePath('src/scroll.d.ts')
  api.removePath('src/boot/scroll.ts')
  api.removePath('src/composables/useScroll.ts')

  if (api.appDir.endsWith('\\dev')) {
    api.removePath('src/boot/scroll-dev.ts')
    api.removePath('src/pages/Scroll.vue')
  }
}
