/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineInstall, getExtensionConfig } = require('..')

module.exports = defineInstall(function (api) {
  const config = getExtensionConfig()

  api.render('./templates/dist', { config })
})
