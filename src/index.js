/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * Docs: https://quasar.dev/app-extensions/development-guide/index-api
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const { IndexDefinition } = require('./lib/extension-wrappers')

const getModules = require('./modules')
const { defineIndex } = getModules

module.exports = defineIndex(function (api) {
  /**
   * @type IndexDefinition[]
   */
  const modules = getModules('index')

  for (const module of modules) {
    module(api)
  }
})
