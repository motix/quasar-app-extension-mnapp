/**
 * Quasar App Extension install script
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/install-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/InstallAPI.js
 */

const { merge } = require('webpack-merge')
const fs = require('fs')
const getModules = require('./modules')

module.exports = function (api) {
  function mergeExtendPackageJson (modules) {
    let extendPackageJson = {}

    for (const module of modules) {
      if (module.extendPackageJson) {
        extendPackageJson = merge(extendPackageJson, module.extendPackageJson)
      }
    }

    return extendPackageJson
  }

  function mergeExtendJsonFiles (modules) {
    const jsonFiles = {}

    for (const module of modules) {
      if (module.extendJsonFiles) {
        for (const file in module.extendJsonFiles) {
          let data = jsonFiles[file] || {}
          data = merge(data, module.extendJsonFiles[file])
          jsonFiles[file] = data
        }
      }
    }

    return jsonFiles
  }

  function run (modules) {
    for (const module of modules) {
      module(api)
    }

    let packageJson = mergeExtendPackageJson(modules)

    packageJson = merge({
      scripts: {
        'i-mnapp': 'quasar ext invoke @motinet/mnapp',
        'u-mnapp': 'quasar ext uninvoke @motinet/mnapp'
      }
    }, packageJson)

    const packageJsonPath = api.resolve.app('package.json')
    const packageJsonBackupPath = api.resolve.app('package-bk.json')

    if (!fs.existsSync(packageJsonBackupPath)) {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      fs.copyFile(packageJsonPath, packageJsonBackupPath, () => { })
    }

    api.extendPackageJson(packageJson)

    api.onExitLog('\x1b[32m              • \x1b[0mPlease manually add \x1b[33mi-mnapp\x1b[0m and \x1b[33mu-mnapp\x1b[0m to \x1b[47m\x1b[30mpackage-bk.json\x1b[0m \x1b[33mscripts\x1b[0m for later use.')

    const jsonFiles = mergeExtendJsonFiles(modules)
    for (const file in jsonFiles) {
      const jsonFilePath = api.resolve.app(file)
      const jsonFileBackupPath = api.resolve.app(`${file.substr(0, file.length - '.json'.length)}-bk.json`)

      if (!fs.existsSync(jsonFileBackupPath)) {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        fs.copyFile(jsonFilePath, jsonFileBackupPath, () => { })
      }

      api.extendJsonFile(file, jsonFiles[file])
    }
  }

  const modules = getModules('install')

  run(modules)
}
