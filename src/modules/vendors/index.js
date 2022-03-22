const { defineIndex, getExtensionConfig } = require('..');

module.exports = defineIndex(function (api) {
  const config = getExtensionConfig();
  const prompts = config.prompts('vendors');
  /**
   * @type string
   */
  const vendorsConfig = prompts.vendors;
  const vendors = vendorsConfig.split(',');

  // Font Awesome Pro, vue-fontawesome
  if (vendors.includes('fap')) {
    api.extendQuasarConf((conf) => {
      conf.framework.iconSet = 'fontawesome-v5-pro';
      conf.boot.unshift('fontawesome-pro');
    });
  }
});
