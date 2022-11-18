/*
Modules:
- map-paths
- frameworks
- vendors
- config
- formats
  Dependencies: map-paths, vendors, config
- select-date-range
  Dependencies: map-paths, vendors, config
- utils
  Dependencies: map-paths, vendors, config, formats
- pageTitle
  Dependencies: config
- shared-components
  Dependencies: map-paths, vendors, config
- document-status
  Dependencies: map-paths, vendors
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
- apexcharts
  Dependencies: multi-views
- firebase
  Dependencies: map-paths, config
- firebase-auth
  Dependencies: map-paths, vendors, config, shared-components, firebase
- firebase-firestore
  Dependencies: map-paths, vendors, config, formats, utils, firebase
- single-scope-composable
  Dependencies: map-paths, vendors
- crud-pages
  Dependencies: map-paths, vendors, config, formats, utils, shared-components,
                notifications, float-toolbar, sticky-headers, multi-views,
                return-url, firebase, firebase-firestore, single-scope-composable
- app-default
  Dependencies: frameworks
*/

const {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  PromptsDefinition,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  InstallDefinition,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  IndexDefinition,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  UninstallDefinition,
} = require('../lib/extension-wrappers');

const fs = require('fs');
const getExtensionConfig = require('../lib/extension-config');

/**
 * @param {string} script
 */
module.exports = function (script) {
  const config = getExtensionConfig();

  /**
   * @type {PromptsDefinition[] | InstallDefinition[] | IndexDefinition[] | UninstallDefinition[]}
   */
  const modules = [];
  const files = fs.readdirSync(__dirname);

  files.forEach((file) => {
    if (file === 'index.js' || !config.hasModule(file)) return;

    try {
      /**
       * @type PromptsDefinition | InstallDefinition | IndexDefinition | UninstallDefinition
       */
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const module = require(`./${file}/${script}`);
      modules.push(module);
    } catch {
      // prompts, install, index or uninstall might be missing in a module
    }
  });

  return modules;
};

const wrappers = require('../lib/extension-wrappers');

module.exports.definePrompts = wrappers.definePrompts;
module.exports.defineInstall = wrappers.defineInstall;
module.exports.defineIndex = wrappers.defineIndex;
module.exports.defineUninstall = wrappers.defineUninstall;

module.exports.getExtensionConfig = getExtensionConfig;
