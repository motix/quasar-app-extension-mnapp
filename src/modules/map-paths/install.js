const getExtensionConfig = require('../extension-config')

module.exports = function (api) {
  const config = getExtensionConfig()

  api.render('./templates/dist', { config })

  if (api.appDir.endsWith('\\dev')) {
    api.render('./templates/dev')
  }

  if (config.hasModule('vite')) {
    api.render('./templates/dist-vite')
  }
}

module.exports.extendJsonFiles = {
  // tsconfig.json
  'tsconfig.json': {
    extends: './tsconfig-map-paths-preset.json'
  }
}
