const getExtensionConfig = require('../extension-config')

module.exports = function (api) {
  const config = getExtensionConfig()
  const prompts = config.prompts('vendors')
  const vendors = prompts.vendors.split(',')

  // Font Awesome Pro, vue-fontawesome
  if (vendors.includes('fap')) {
    api.extendQuasarConf((conf) => {
      conf.framework.iconSet = 'fontawesome-v5-pro'
      conf.boot.push('fontawesome-pro')
    })
  }
}
