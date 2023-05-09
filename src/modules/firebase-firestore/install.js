const { defineInstall } = require('..');

module.exports = defineInstall(function (api) {
  api.render('./templates/dist');
});
