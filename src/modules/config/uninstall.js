const { defineUninstall } = require('..');

module.exports = defineUninstall(function (api) {
  api.removePath('src/composables/useConfig.ts');
});
