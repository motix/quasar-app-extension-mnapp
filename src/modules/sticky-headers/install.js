/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineInstall } = require('..')

module.exports = defineInstall(function (api) {
  api.render('./templates/dist')
})
