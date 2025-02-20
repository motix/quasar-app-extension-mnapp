// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { InstallDefinition } = require('./lib/extension-wrappers');

const getPackageName = require('./lib/package-name');
const { backupFile } = require('./lib/file-backup');
const { reduceJsonFile } = require('./lib/json-helpers');
const getModules = require('./modules');
const { defineInstall } = getModules;

module.exports = defineInstall(function (api) {
  /**
   * @type InstallDefinition[]
   */
  const modules = getModules('install');

  backupFile(api, 'package.json');
  backupFile(api, 'tsconfig.json');

  const packageName = getPackageName();

  const scripts = {};
  scripts[`i-${packageName}`] = `quasar ext invoke @motinet/${packageName}`;
  scripts[`u-${packageName}`] = `quasar ext uninvoke @motinet/${packageName}`;
  scripts[`r-${packageName}`] = `yarn u-${packageName} && yarn i-${packageName}`;

  // Remove current i- to keep i-, u- and r- together
  reduceJsonFile(api, 'package.json', [`scripts.i-${packageName}`]);
  api.extendPackageJson({
    scripts,
  });
  delete require.cache[api.resolve.app('package.json')];

  for (const module of modules) {
    module(api);
  }
});
