/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineUninstall } = require('..')

module.exports = defineUninstall(function (api) {
  api.removePath('src/return-url.d.ts')
  api.removePath('src/boot/return-url.ts')
  api.removePath('src/composables/useReturnUrl.ts')
})
