/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineUninstall } = require('..')

module.exports = defineUninstall(function (api) {
  api.removePath('src/shared-components.d.ts')
  api.removePath('src/boot/shared-components.ts')
  api.removePath('src/components/shared/expandable-card')
  api.removePath('src/components/shared/transitions')
  api.removePath('src/components/shared/Gravatar.vue')
  api.removePath('src/components/shared/PercentInput.vue')
  api.removePath('src/components/shared/TopTooltip.vue')
  api.removePath('src/components/shared/QPagePadding.vue')

  if (api.appDir.endsWith('\\dev')) {
    api.removePath('src/boot/shared-components-dev.ts')
    api.removePath('src/pages/SharedComponents.vue')
  }
})
