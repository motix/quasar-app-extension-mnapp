const { defineIndex } = require('..');

// Give the function a name to identify the module when replacing prompts from app config in extension wrapper
module.exports = defineIndex(function vendors(api) {
  /**
   * @type string
   */
  const vendorsConfig = api.prompts.vendors;
  const vendors = vendorsConfig.split(',');

  // Font Awesome Pro, vue-fontawesome
  if (vendors.includes('fap')) {
    api.extendQuasarConf((conf) => {
      conf.framework.iconSet = 'fontawesome-v5-pro';
      conf.boot.unshift('fontawesome-pro');
    });
  }
});
