const getExtensionConfig = require('../extension-config')

module.exports = function (api) {
  const config = getExtensionConfig()
  const prompts = config.prompts('vendors')
  const vendors = prompts.vendors.split(',')

  // Pinia
  if (vendors.includes('pin')) {
    api.extendQuasarConf((conf) => {
      conf.boot.unshift('pinia')
    })
  }

  // Font Awesome Pro, vue-fontawesome
  if (vendors.includes('fap')) {
    api.extendQuasarConf((conf) => {
      conf.framework.iconSet = 'fontawesome-v5-pro'
      conf.boot.unshift('fontawesome-pro')
    })
  }
}
