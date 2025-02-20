// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { UninstallDefinition } = require('./lib/extension-wrappers');

const getPackageName = require('./lib/package-name');
const { reduceJsonFile } = require('./lib/json-helpers');
const getModules = require('./modules');
const { defineUninstall } = getModules;

module.exports = defineUninstall(function (api) {
  /**
   * @type UninstallDefinition[]
   */
  const modules = getModules('uninstall');

  for (const module of modules) {
    module(api);
  }

  const packageName = getPackageName();

  reduceJsonFile(api, 'package.json', [`scripts.u-${packageName}`, `scripts.r-${packageName}`]);
});
