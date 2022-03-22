const { defineIndex } = require('..');

module.exports = defineIndex(function (api) {
  api.extendQuasarConf((conf) => {
    conf.framework.plugins.push('Meta', 'Notify', 'Dialog');
  });
});
