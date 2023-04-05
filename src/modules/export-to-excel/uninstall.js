const { defineUninstall } = require('..');

module.exports = defineUninstall(function (api) {
  api.removePath('src/utils/saveExcelFile.ts');
});

module.exports.revertFiles = ['package.json'];
