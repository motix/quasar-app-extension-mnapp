const { reduceJsonFile } = require('../../lib/json-helpers');
const { defineUninstall } = require('..');

module.exports = defineUninstall(function (api) {
  api.removePath('src/utils/saveExcelFile.ts');

  reduceJsonFile(api, 'package.json', [
    'dependencies.exceljs',
    'dependencies.file-saver',
    'devDependencies.@types/file-saver',
  ]);
});
