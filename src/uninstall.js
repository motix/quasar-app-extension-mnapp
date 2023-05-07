/**
 * Quasar App Extension uninstall script
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/uninstall-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/UninstallAPI.js
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { UninstallDefinition } = require('./lib/extension-wrappers');

const fs = require('fs');
const getAppName = require('./lib/app-name');
const getModules = require('./modules');
const { defineUninstall } = getModules;

module.exports = defineUninstall(function (api) {
  /**
   * @param {UninstallDefinition[]} modules
   */
  function mergeRevertFiles(modules) {
    /**
     * @type string[]
     */
    let files = [];

    for (const module of modules) {
      if (module.revertFiles) {
        files = [...files, ...module.revertFiles];
      }
    }

    return files;
  }

  /**
   * @type UninstallDefinition[]
   */
  const modules = getModules('uninstall');

  for (const module of modules) {
    module(api);
  }

  const revertFiles = [...mergeRevertFiles(modules), 'package.json'];

  for (const file of revertFiles) {
    const backupFile = `${file.substring(
      0,
      file.length - '.json'.length
    )}-bk.json`;
    const filePath = api.resolve.app(file);
    const fileBackupPath = api.resolve.app(backupFile);

    if (fs.existsSync(filePath) && fs.existsSync(fileBackupPath)) {
      fs.copyFileSync(fileBackupPath, filePath);
      api.removePath(backupFile);
    }
  }

  const appName = getAppName();

  api.onExitLog(
    `\x1b[32m              • \x1b[0mPlease remove \x1b[33mi-${appName}\x1b[0m from \x1b[47m\x1b[30mpackage-bk.json\x1b[0m \x1b[33mscripts\x1b[0m if no longer used.`
  );
});
