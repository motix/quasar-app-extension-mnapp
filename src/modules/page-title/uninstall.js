/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineUninstall } = require('..')

module.exports = defineUninstall(function (api) {
  api.removePath('src/page-title.d.ts')
  api.removePath('src/boot/page-title.ts')
  api.removePath('src/composables/usePageTitle.ts')
})
