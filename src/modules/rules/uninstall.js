module.exports = function (api) {
  api.removePath('src/composables/use-rules.ts')

  if (api.appDir.endsWith('\\dev')) {
    api.removePath('src/boot/rules-dev.ts')
    api.removePath('src/pages/Rules.vue')
  }
}
