// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { InstallDefinition } = require('./lib/extension-wrappers');

const fs = require('fs');
const getPackageName = require('./lib/package-name');
const { reduceJsonFile } = require('./lib/json-helpers');
const getModules = require('./modules');
const { defineInstall } = getModules;

module.exports = defineInstall(function (api) {
  /**
   * @param {string} relativePath
   */
  function backupFile(relativePath) {
    const filePath = api.resolve.app(relativePath);
    const fileBackupPath = api.resolve.app(
      `${relativePath.substring(
        0,
        relativePath.length - '.json'.length
      )}-bk.json`
    );

    if (!fs.existsSync(fileBackupPath)) {
      fs.copyFileSync(filePath, fileBackupPath);
    }
  }

  /**
   * @type InstallDefinition[]
   */
  const modules = getModules('install');

  backupFile('package.json');
  backupFile('tsconfig.json');

  const packageName = getPackageName();

  const scripts = {};
  scripts[`i-${packageName}`] = `quasar ext invoke @motinet/${packageName}`;
  scripts[`u-${packageName}`] = `quasar ext uninvoke @motinet/${packageName}`;
  scripts[
    `r-${packageName}`
  ] = `yarn u-${packageName} && yarn i-${packageName}`;

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
