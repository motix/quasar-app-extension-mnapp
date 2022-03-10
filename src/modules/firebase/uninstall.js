/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineUninstall } = require('..')

module.exports = defineUninstall(function (api) {
  api.removePath('env-template.txt')
  api.removePath('firebase.json')
  api.removePath('.mnapp-vite/firebase.ts')
  api.removePath('.mnapp-vite/firebase.d.ts')
  api.removePath('src/firebase.d.ts')
  api.removePath('src/boot/firebase.ts')
  api.removePath('src/services/firebase.ts')

  api.onExitLog('\x1b[32mfirebase      • \x1b[0mPlease remove \x1b[47m\x1b[30m./.env\x1b[0m if no longer used.')
})

module.exports.revertFiles = [
  'package.json'
]
