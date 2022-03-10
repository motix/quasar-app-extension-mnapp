/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineUninstall } = require('..')

module.exports = defineUninstall(function (api) {
  api.removePath('src/crud-pages.d.ts')
  api.removePath('src/boot/crud-pages.ts')
  api.removePath('src/components/shared/crud-pages')
  api.removePath('src/composables/crud-pages')
})
