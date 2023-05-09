const InstallAPI = require('@quasar/app-vite/lib/app-extension/InstallAPI');
const getExtensionConfig = require('./extension-config');
const normalizeModuleName = require('./normalize-module-name');

/**
 * @param {function} callback
 */
module.exports.definePrompts = function (callback) {
  return callback;
};

/**
 * @param {function} callback
 */
module.exports.defineInstall = function (callback) {
  return (api) => {
    mergePrompts(callback, api);
    callback(api);
  };
};

/**
 * @param {function} callback
 */
module.exports.defineIndex = function (callback) {
  return (api) => {
    mergePrompts(callback, api);
    callback(api);
  };
};

/**
 * @param {function} callback
 */
module.exports.defineUninstall = function (callback) {
  return (api) => {
    api.extendJsonFile = new InstallAPI({
      extId: api.extId,
      prompts: api.prompts,
    }).extendJsonFile;

    mergePrompts(callback, api);
    callback(api);
  };
};

function mergePrompts(callback, api) {
  const config = getExtensionConfig();
  const moduleName = normalizeModuleName(callback.name);

  if (config.hasPrompts(moduleName)) {
    const promptsConfig = config.prompts(moduleName);

    for (const prompt in promptsConfig) {
      if (
        promptsConfig[prompt] !== undefined &&
        api.prompts[prompt] === undefined
      ) {
        api.prompts[prompt] = promptsConfig[prompt];
      }
    }
  }
}
