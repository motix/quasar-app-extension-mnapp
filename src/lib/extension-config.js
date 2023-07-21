/**
 * @type {{appDir: string}}
 */
const appPaths = require('@quasar/app-vite/lib/app-paths');
const getPackageName = require('./package-name');

module.exports = function () {
  /**
   * @type Record<string, {prompts: Record<string, unknown>}> & {hasModule: (name: string) => boolean, hasPrompts: (name: string) => boolean, prompts: (name: string) => Record<string, unknown>, moduleIndex: (name: string) => number}
   */
  let config = {
    /**
     * @param {string} name
     */
    hasModule: (name) => !!config[name],
    /**
     * @param {string} name
     */
    hasPrompts: (name) => !!config[name]?.prompts,
    /**
     * @param {string} name
     */
    prompts: (name) => config[name].prompts,
    /**
     * @param {string} name
     */
    moduleIndex: (name) => moduleNames.indexOf(name),
  };

  /**
   * @type {string[]}
   */
  let moduleNames = [];

  try {
    const packageName = getPackageName().replace(/-/g, '');
    /**
     * @type {Record<string, unknown>}
     */
    const configData = require(`${appPaths.appDir}/.${packageName}rc`);

    moduleNames = Object.getOwnPropertyNames(configData);
    config = {
      ...configData,
      ...config,
    };
  } catch {
    // .[packageName]rc.js might not exist in appDir
  }

  return config;
};
