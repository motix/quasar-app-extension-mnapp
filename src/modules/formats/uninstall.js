const { defineUninstall } = require('..');

module.exports = defineUninstall(function (api) {
  api.removePath('src/boot/formats.ts');
  api.removePath('src/composables/formats');
  api.removePath('src/composables/useFormats.ts');
  api.removePath('src/types/formats.d.ts');
});
