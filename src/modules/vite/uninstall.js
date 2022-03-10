/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineUninstall } = require('..')

module.exports = defineUninstall(function (api) {
  api.removePath('tsconfig-quasar-preset.json')
  api.removePath('tsconfig-vite-preset.json')
  api.removePath('tsconfig.node.json')
  api.removePath('tsconfig.eslint.json')
  api.removePath('vite.config.ts')
  api.removePath('index.html')
  api.removePath('.mnapp-vite')
  api.removePath('src/vite.d.ts')
  api.removePath('src/main.ts')

  api.onExitLog('\x1b[32mvite          • \x1b[0mPlease remove \x1b[33mresolve(__dirname, \'./tsconfig.eslint.json\')\x1b[0m under \x1b[33mparserOptions.project\x1b[0m setting from \x1b[47m\x1b[30m.eslintrc.js\x1b[0m.')
})

module.exports.revertFiles = [
  'package.json',
  'tsconfig.json'
]
