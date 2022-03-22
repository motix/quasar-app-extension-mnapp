const { defineUninstall } = require('..');

module.exports = defineUninstall(function (api) {
  api.removePath('src/boot/page-title.ts');
  api.removePath('src/composables/usePageTitle.ts');
  api.removePath('src/types/page-title.d.ts');
});
