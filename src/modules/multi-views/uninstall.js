module.exports = function (api) {
  api.removePath('src/components/shared/SwitchViewButton.vue')
  api.removePath('src/composables/use-multi-views.ts')

  if (api.appDir.endsWith('\\dev')) {
    api.removePath('src/boot/multi-views-dev.ts')
    api.removePath('src/pages/MultiViews.vue')
  }
}
