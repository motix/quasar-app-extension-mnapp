/*
Modules:
- map-paths
- frameworks
- vite
- vendors
- config
- pageTitle
  Dependencies: config
- shared-components
  Dependencies: map-paths, vendors, config
- firebase
  Dependencies: frameworks, vendors, config, shared-components
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
- sticky-headers
  Dependencies: map-paths, shared-components
- multi-views
  Dependencies: map-paths, vendors, shared-components, scroll
- return-url
  Dependencies: map-paths
- single-scope-composable
  Dependencies: map-paths, vendors
- crud-pages
  Dependencies: map-paths, vendors, config, shared-components, firebase,
                notifications, float-toolbar, sticky-headers, multi-views,
                return-url, single-scope-composable
- authentication
  Dependencies: frameworks, vendors
- app-default
  Dependencies: frameworks, config
*/

const fs = require('fs')
const getExtensionConfig = require('./extension-config')

module.exports = function (script) {
  const config = getExtensionConfig()

  const modules = []
  const files = fs.readdirSync(__dirname)

  files.forEach(file => {
    if (
      file === 'index.js' ||
      file === 'extension-config.js' ||
      !config.hasModule(file)
    ) return

    try {
      const module = require(`./${file}/${script}`)
      modules.push(module)
    } catch {
      // prompts, install, index or uninstall might be missing in a module
    }
  })

  return modules
}
