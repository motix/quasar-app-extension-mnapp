const { defineUninstall } = require('..');

module.exports = defineUninstall(function (api) {
  api.removePath('src/boot/return-url.ts');
  api.removePath('src/composables/useReturnUrl.ts');
  api.removePath('src/types/return-url.d.ts');
});
