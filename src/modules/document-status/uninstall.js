const { defineUninstall } = require('..');

module.exports = defineUninstall(function (api) {
  api.removePath('src/components/shared/document-status');
  api.removePath('src/utils/DocumentStatusBase.ts');
});
