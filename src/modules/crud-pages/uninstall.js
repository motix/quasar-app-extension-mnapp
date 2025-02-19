const { defineUninstall } = require('..');

module.exports = defineUninstall(function (api) {
  api.removePath('src/boot/crud-pages.ts');
  api.removePath('src/components/shared/crud-pages');
  api.removePath('src/composables/crud-pages');
  api.removePath('src/types/crud-pages.d.ts');

  reduceJsonFile(api, 'package.json', ['dependencies.type-fest']);
});
