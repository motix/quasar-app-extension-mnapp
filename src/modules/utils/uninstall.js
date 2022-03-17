/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineUninstall } = require('..')

module.exports = defineUninstall(function (api) {
  api.removePath('src/automapper.d.ts')
  api.removePath('src/utils/automapper.ts')
  api.removePath('src/utils/calculation.ts')
  api.removePath('src/utils/DocumentStatusBase.ts')
  api.removePath('src/utils/normalization.ts')
  api.removePath('src/utils/validation.ts')
})
