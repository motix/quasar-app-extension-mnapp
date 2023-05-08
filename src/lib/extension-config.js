/**
 * @type {{appDir: string}}
 */
const appPaths = require('@quasar/app-vite/lib/app-paths');
const getPackageName = require('./package-name');

module.exports = function () {
  /**
   * @type Record<string, {prompts: Record<string, unknown>}> & {hasModule: (name: string) => boolean, hasPrompts: (name: string) => boolean, prompts: (name: string) => Record<string, unknown>}
   */
  let config = {
    /**
     * @param {string} name
     */
    hasModule: (name) => config[name] !== false,
    /**
     * @param {string} name
     */
    hasPrompts: (name) => !!config[name]?.prompts,
    /**
     * @param {string} name
     */
    prompts: (name) => config[name].prompts,
  };

  try {
    const packageName = getPackageName().replace(/-/g, '');

    config = {
      ...require(`${appPaths.appDir}/.${packageName}rc`),
      ...config,
    };
  } catch {
    // .[packageName]rc.js might not exist in appDir
  }

  return config;
};
