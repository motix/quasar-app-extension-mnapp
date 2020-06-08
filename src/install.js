/**
 * Quasar App Extension install script
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/install-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/InstallAPI.js
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const merge = require('webpack-merge')

const app = require('./modules/app/install')
const authentication = require('./modules/authentication/install')

module.exports = function (api) {
  function mergeExtendPackageJson (...modules) {
    let extendPackageJson = {}

    for (const module of modules) {
      if (module.extendPackageJson) {
        extendPackageJson = merge(extendPackageJson, module.extendPackageJson)
      }
    }

    return extendPackageJson
  }

  function mergeExtendJsonFiles (...modules) {
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

  app(api)
  authentication(api)

  api.extendPackageJson(mergeExtendPackageJson(app, authentication))

  const jsonFiles = mergeExtendJsonFiles(app, authentication)
  for (const file in jsonFiles) {
    api.extendJsonFile(file, jsonFiles[file])
  }
}
