/*
Modules:
- map-paths
- frameworks
  Dependencies: map-paths
- vendors
- config
- shared-components
  Dependencies: map-paths, vendors, config
- formats
  Dependencies: map-paths, vendors, config
- rules
  Dependencies: map-paths, config
- notifications
  Dependencies: frameworks
- scroll
  Dependencies: map-paths, config
- float-toolbar
  Dependencies: map-paths
- multi-views
  Dependencies: map-paths, vendors, shared-components, scroll
- authentication
  Dependencies: frameworks, vendors
- app
  Dependencies: frameworks
*/

const fs = require('fs')
const getExtensionConfig = require('./extension-config')

module.exports = function (script) {
  const extensionConfig = getExtensionConfig()

  const modules = []
  const files = fs.readdirSync(__dirname)

  files.forEach(file => {
    if (file === 'index.js' || file === 'extension-config.js' || extensionConfig[file] === false) return

    try {
      const module = require(`./${file}/${script}`)
      modules.push(module)
    } catch {
      // prompts, install, index or uninstall might be missing in a module
    }
  })

  return modules
}
