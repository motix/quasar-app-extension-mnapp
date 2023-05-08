// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BaseAPI = require('@quasar/app-vite/lib/app-extension/BaseAPI');

const fs = require('fs');
const { unset } = require('lodash');

/**
 * @param {BaseAPI} api
 * @param {string} file
 * @param {string[]} paths
 */
module.exports.reduceJsonFile = function (api, file, paths) {
  const jsonPath = api.resolve.app(file);
  const json = require(jsonPath);

  if (json) {
    for (const path of paths) {
      unset(json, path);
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2));
};
