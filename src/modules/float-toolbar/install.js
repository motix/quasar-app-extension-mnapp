const { defineInstall } = require('..');

module.exports = defineInstall(function (api) {
  api.render('./templates/dist');

  if (api.appDir.endsWith('\\dev')) {
    api.render('./templates/dev');
  }
});
