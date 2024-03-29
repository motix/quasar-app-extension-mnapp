const { defineIndex } = require('..');

module.exports = defineIndex(function (api) {
  api.extendQuasarConf((conf) => {
    conf.boot.push('scroll');
  });

  if (api.appDir.endsWith('\\dev')) {
    api.extendQuasarConf((conf) => {
      conf.boot.push('scroll-dev');
    });
  }
});
