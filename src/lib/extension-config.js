/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * @type {{appDir: string}}
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const appPaths = require('@quasar/app/lib/app-paths')

module.exports = function () {
  /**
   * @type Record<string, {prompts: Record<string, unknown>}> & {hasModule: (name: string) => boolean, hasPrompts: (name: string) => boolean, prompts: (name: string) => Record<string, unknown>}
   */
  let config = {
    /**
     * @param {string} name
     */
    hasModule: name => config[name] !== false,
    /**
     * @param {string} name
     */
    hasPrompts: name => !!config[name]?.prompts,
    /**
     * @param {string} name
     */
    prompts: name => config[name].prompts
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    config = {
      ...require(`${appPaths.appDir}/.mnapprc`),
      ...config
    }
  } catch {
    // .mnapprc.js might not exist in appDir
  }

  return config
}
