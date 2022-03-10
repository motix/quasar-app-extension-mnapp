/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineUninstall } = require('..')

module.exports = defineUninstall(function () {
  //
})

module.exports.revertFiles = [
  'package.json'
]
