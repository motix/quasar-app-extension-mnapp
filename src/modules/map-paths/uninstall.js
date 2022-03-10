/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineUninstall } = require('..')

module.exports = defineUninstall(function (api) {
  api.removePath('.mnapp-vite/map-paths.ts')
  api.removePath('.mnapp-vite/map-paths.d.ts')
  api.removePath('tsconfig-map-paths-preset.json')
})

module.exports.revertFiles = [
  'tsconfig.json'
]
