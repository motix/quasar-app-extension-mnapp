const appPaths = require('@quasar/app/lib/app-paths')

module.exports = function () {
  let config = {
    hasModule: (name) => config[name] !== false,
    hasPrompts: (name) => !!config[name]?.prompts,
    prompts: (name) => config[name].prompts
  }
  try {
    config = {
      ...require(`${appPaths.appDir}/.mnapprc`),
      ...config
    }
  } catch {
    // .mnapprc.js might not exist in appDir
  }

  return config
}
