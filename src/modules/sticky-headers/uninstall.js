/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineUninstall } = require('..')

module.exports = defineUninstall(function (api) {
  api.removePath('src/components/shared/StickyHeaders.vue')
  api.removePath('src/composables/useStickyHeaders.ts')
})
