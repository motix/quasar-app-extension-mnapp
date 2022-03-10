/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineInstall, getExtensionConfig } = require('..')

module.exports = defineInstall(function (api) {
  const config = getExtensionConfig()

  api.render('./templates/dist', { config })

  if (config.hasModule('vite')) {
    api.render('./templates/dist-vite')
  }
})

module.exports.extendJsonFiles = {
  // tsconfig.json
  'tsconfig.json': {
    extends: './tsconfig-map-paths-preset.json'
  }
}
