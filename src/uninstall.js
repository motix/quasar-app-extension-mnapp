/**
 * Quasar App Extension uninstall script
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/uninstall-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/UninstallAPI.js
 */

const fs = require('fs')
const getModules = require('./modules')

module.exports = function (api) {
  function mergeRevertFiles (modules) {
    let files = []

    for (const module of modules) {
      if (module.revertFiles) {
        files = [...files, ...module.revertFiles]
      }
    }

    return files
  }

  const modules = getModules('uninstall')

  for (const module of modules) {
    module(api)
  }

  const revertFiles = mergeRevertFiles(modules)
  for (const file of revertFiles) {
    const backupFile = `${file.substr(0, file.length - '.json'.length)}-bk.json`
    const filePath = api.resolve.app(file)
    const fileBackupPath = api.resolve.app(backupFile)

    if (fs.existsSync(filePath) && fs.existsSync(fileBackupPath)) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      fs.copyFile(fileBackupPath, filePath, () => { })
      api.removePath(backupFile)
    }
  }
}
