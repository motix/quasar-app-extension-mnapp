const { defineUninstall } = require('..');

module.exports = defineUninstall(function (api) {
  api.removePath('src/models/single-scope-composable');
  api.removePath('src/stores/SingleScopeComposable.ts');
});
