module.exports = function (api) {
  api.removePath('src/boot/shared-components.ts')
  api.removePath('src/components/shared/expandable-card')
  api.removePath('src/components/shared/transitions')
  api.removePath('src/components/shared/Gravatar.vue')
  api.removePath('src/components/shared/PercentInput.vue')
  api.removePath('src/components/shared/TopTooltip.vue')

  if (api.appDir.endsWith('\\dev')) {
    api.removePath('src/boot/shared-components-dev.ts')
    api.removePath('src/pages/SharedComponents.vue')
  }
}
