const { defineIndex } = require('..');

module.exports = defineIndex(function (api) {
  if (api.appDir.endsWith('\\dev')) {
    api.extendQuasarConf((conf) => {
      conf.boot.push('multi-views-dev');
    });
  }
});
