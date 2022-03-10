/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineIndex } = require('..')

module.exports = defineIndex(function (api) {
  api.extendQuasarConf(conf => {
    conf.boot.push('shared-components')
  })

  if (api.appDir.endsWith('\\dev')) {
    api.extendQuasarConf(conf => {
      conf.boot.push('shared-components-dev')
    })
  }
})
