const appPaths = require('@quasar/app/lib/app-paths')

module.exports = function () {
  let extensionConfig = {}
  try {
    extensionConfig = require(`${appPaths.appDir}/.mnapprc`)
  } catch {
    // .mnapprc.js might not exist in appDir
  }

  return extensionConfig
}
