/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineIndex, getExtensionConfig } = require('..')

module.exports = defineIndex(function (api) {
  const config = getExtensionConfig()
  const prompts = config.prompts('vendors')
  /**
   * @type string
   */
  const vendorsConfig = prompts.vendors
  const vendors = vendorsConfig.split(',')

  // Pinia
  if (vendors.includes('pin')) {
    api.extendQuasarConf(conf => {
      conf.boot.unshift('pinia')
    })
  }

  // Font Awesome Pro, vue-fontawesome
  if (vendors.includes('fap')) {
    api.extendQuasarConf(conf => {
      conf.framework.iconSet = 'fontawesome-v5-pro'
      conf.boot.unshift('fontawesome-pro')
    })
  }
})
