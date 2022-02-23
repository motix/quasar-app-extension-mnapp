const getExtensionConfig = require('../extension-config')

module.exports = function (api) {
  const config = getExtensionConfig()
  const prompts = config.prompts('app-default')

  api.render('./templates/dist', {
    prompts
  })

  if (api.appDir.endsWith('\\dev')) {
    api.render('./templates/dev')
  }

  api.onExitLog('\x1b[32mapp-default   • \x1b[0mPlease add \x1b[47m\x1b[30mmkcerts\x1b[0m files as instructed.')
  api.onExitLog('\x1b[32mapp-default   • \x1b[0mPlease add \x1b[33m@import \'./quasar.variables-custom.scss\'\x1b[0m to \x1b[47m\x1b[30m./src/css/quasar.variables.scss\x1b[0m.')

  if (config.hasModule('vite')) {
    api.render('./templates/dist-vite', {
      prompts
    })
  }
}