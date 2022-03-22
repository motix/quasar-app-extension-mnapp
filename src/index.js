// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { IndexDefinition } = require('./lib/extension-wrappers');

const getModules = require('./modules');
const { defineIndex } = getModules;

module.exports = defineIndex(function (api) {
  /**
   * @type IndexDefinition[]
   */
  const modules = getModules('index');

  for (const module of modules) {
    module(api);
  }
});
