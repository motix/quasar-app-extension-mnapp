/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineUninstall } = require('..')

module.exports = defineUninstall(function (api) {
  // Pinia
  api.removePath('src/boot/pinia.ts')
  // Font Awesome Pro, vue-fontawesome
  api.removePath('src/boot/fontawesome-pro.ts')

  api.onExitLog('\x1b[32mvendors       • \x1b[0mPlease remove \x1b[47m\x1b[30m./.npmrc\x1b[0m if no longer used.')
})

module.exports.revertFiles = [
  'package.json'
]
