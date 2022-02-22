module.exports = function (api) {
  api.removePath('src/components/shared/FloatToolbar.vue')
  api.removePath('src/components/shared/FloatToolbar.ts')
  api.removePath('src/composables/useFloatToolbar.ts')

  if (api.appDir.endsWith('\\dev')) {
    api.removePath('src/boot/float-toolbar-dev.ts')
    api.removePath('src/layouts/FloatToolbarLayout.vue')
    api.removePath('src/pages/FloatToolbar.vue')
  }
}
