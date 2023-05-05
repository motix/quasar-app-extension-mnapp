const { defineUninstall } = require('..');

module.exports = defineUninstall(function (api) {
  api.removePath('src/types/automapper.d.ts');
  api.removePath('src/utils/automapper.ts');
  api.removePath('src/utils/calculation.ts');
  api.removePath('src/utils/imageFileToBase64.ts');
  api.removePath('src/utils/imageUrlToBase64.ts');
  api.removePath('src/utils/normalization.ts');
  api.removePath('src/utils/stringContains.ts');
  api.removePath('src/utils/validation.ts');
});
