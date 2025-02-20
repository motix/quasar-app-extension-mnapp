// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BaseAPI = require('@quasar/app-vite/lib/app-extension/BaseAPI');

const fs = require('fs');
const { unset, get } = require('lodash-es');

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

    fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2));
  }
};

/**
 * @param {BaseAPI} api
 * @param {string} file
 * @param {{path: string, value: unknown}[]} pathAndValues
 */
module.exports.reduceJsonFileArray = function (api, file, pathAndValues) {
  const jsonPath = api.resolve.app(file);
  const json = require(jsonPath);

  if (json) {
    for (const { path, value } of pathAndValues) {
      /**
       * @type unknown[]
       */
      const values = get(json, path);

      if (values?.includes(value)) {
        values.splice(values.indexOf(value), 1);
      }
    }

    fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2));
  }
};
