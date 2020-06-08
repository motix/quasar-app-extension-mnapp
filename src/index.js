/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

/* eslint-disable @typescript-eslint/no-var-requires */

const app = require('./modules/app')
const authentication = require('./modules/authentication')

module.exports = function (api) {
  app(api)
  authentication(api)
}
