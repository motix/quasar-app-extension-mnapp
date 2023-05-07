// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { InstallDefinition } = require('./lib/extension-wrappers');

const { merge } = require('webpack-merge');
const fs = require('fs');
const getAppName = require('./lib/app-name');
const getModules = require('./modules');
const { defineInstall } = getModules;

module.exports = defineInstall(function (api) {
  /**
   * @param {InstallDefinition[]} modules
   */
  function mergeExtendPackageJson(modules) {
    let extendPackageJson = {};

    for (const module of modules) {
      if (module.extendPackageJson) {
        extendPackageJson = merge(extendPackageJson, module.extendPackageJson);
      }
    }

    return extendPackageJson;
  }

  /**
   * @param {InstallDefinition[]} modules
   */
  function mergeExtendJsonFiles(modules) {
    /**
     * @type Record<string, unknown>
     */
    const jsonFiles = {};

    for (const module of modules) {
      if (module.extendJsonFiles) {
        for (const file in module.extendJsonFiles) {
          let data = jsonFiles[file] || {};
          data = merge(data, module.extendJsonFiles[file]);
          jsonFiles[file] = data;
        }
      }
    }

    return jsonFiles;
  }

  /**
   * @param {InstallDefinition[]} modules
   */
  function run(modules) {
    for (const module of modules) {
      module(api);
    }

    const appName = getAppName();
    let packageJson = mergeExtendPackageJson(modules);

    const scripts = {};
    scripts[`i-${appName}`] = `quasar ext invoke @motinet/${appName}`;
    scripts[`u-${appName}`] = `quasar ext uninvoke @motinet/${appName}`;
    scripts[`r-${appName}`] = `yarn u-${appName} && yarn i-${appName}`;

    packageJson = merge(
      {
        scripts,
      },
      packageJson
    );

    const packageJsonPath = api.resolve.app('package.json');
    const packageJsonBackupPath = api.resolve.app('package-bk.json');

    if (!fs.existsSync(packageJsonBackupPath)) {
      fs.copyFileSync(packageJsonPath, packageJsonBackupPath);
    }

    api.extendPackageJson(packageJson);

    api.onExitLog(
      `\x1b[32m              • \x1b[0mPlease manually add \x1b[33mi-${appName}\x1b[0m to \x1b[47m\x1b[30mpackage-bk.json\x1b[0m \x1b[33mscripts\x1b[0m for later use.`
    );

    const jsonFiles = mergeExtendJsonFiles(modules);
    for (const file in jsonFiles) {
      const jsonFilePath = api.resolve.app(file);
      const jsonFileBackupPath = api.resolve.app(
        `${file.substring(0, file.length - '.json'.length)}-bk.json`
      );

      if (!fs.existsSync(jsonFileBackupPath)) {
        fs.copyFileSync(jsonFilePath, jsonFileBackupPath);
      }

      api.extendJsonFile(file, jsonFiles[file]);
    }
  }

  /**
   * @type InstallDefinition[]
   */
  const modules = getModules('install');

  run(modules);
});
