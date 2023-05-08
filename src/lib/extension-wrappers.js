const InstallAPI = require('@quasar/app-vite/lib/app-extension/InstallAPI');

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
  return callback;
};

/**
 * @param {function} callback
 */
module.exports.defineIndex = function (callback) {
  return callback;
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

    callback(api);
  };
};
