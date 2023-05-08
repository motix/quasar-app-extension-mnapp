const { reduceJsonFile } = require('../../lib/json-helpers');
const { defineUninstall } = require('..');

module.exports = defineUninstall(function (api) {
  reduceJsonFile(api, 'tsconfig.json', ['compilerOptions.paths']);
});
