/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineUninstall } = require('..')

module.exports = defineUninstall(function (api) {
  api.removePath('src/formats.d.ts')
  api.removePath('src/boot/formats.ts')
  api.removePath('src/composables/useFormats.ts')
  api.removePath('src/composables/formats')
})
