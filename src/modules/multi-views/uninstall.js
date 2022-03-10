/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineUninstall } = require('..')

module.exports = defineUninstall(function (api) {
  api.removePath('src/components/shared/SwitchViewButton.vue')
  api.removePath('src/composables/useMultiViews.ts')

  if (api.appDir.endsWith('\\dev')) {
    api.removePath('src/boot/multi-views-dev.ts')
    api.removePath('src/pages/MultiViews.vue')
  }
})
