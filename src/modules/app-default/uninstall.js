/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineUninstall } = require('..')

module.exports = defineUninstall(function (api) {
  api.removePath('.mnapp-vite/app-default.ts')
  api.removePath('.mnapp-vite/app-default.d.ts')
  api.removePath('.vscode/launch.json')
  api.removePath('mkcerts/Instructions.md')
  api.removePath('src/app-default.d.ts')
  api.removePath('src/boot/notify.ts')
  api.removePath('src/css/quasar.variables-custom.scss')
  api.removePath('src/css/app-default.scss')
  api.removePath('src/layouts/AliveSubLayout.vue')

  api.onExitLog('\x1b[32mapp-default   • \x1b[0mPlease remove \x1b[47m\x1b[30m./.mkcerts\x1b[0m if no longer used.')
  api.onExitLog('\x1b[32mapp-default   • \x1b[0mPlease remove \x1b[33m@import \'./quasar.variables-custom.scss\'\x1b[0m from \x1b[47m\x1b[30m./src/css/quasar.variables.scss\x1b[0m.')
})
