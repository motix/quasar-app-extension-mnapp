/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

const getModules = require('./modules')

module.exports = function (api) {
  const modules = getModules('index')

  for (const module of modules) {
    module(api)
  }
}
