module.exports = function (api) {
  api.removePath('src/composables/use-formats.ts')
  api.removePath('src/composables/formats')

  if (api.appDir.endsWith('\\dev')) {
    api.removePath('src/boot/formats-dev.ts')
    api.removePath('src/pages/Formats.vue')
  }
}
