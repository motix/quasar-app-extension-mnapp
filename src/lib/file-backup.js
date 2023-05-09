// eslint-disable-next-line @typescript-eslint/no-unused-vars
const BaseAPI = require('@quasar/app-vite/lib/app-extension/BaseAPI');

const fs = require('fs');
const path = require('path');

/**
 * @param {BaseAPI} api
 * @param {string} relativePath
 */
module.exports.backupFile = function (api, relativePath) {
  const filePath = api.resolve.app(relativePath);
  const fileBackupPath = api.resolve.app(`bk/${relativePath}`);
  const backupDir = path.dirname(fileBackupPath);

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  if (!fs.existsSync(fileBackupPath)) {
    fs.copyFileSync(filePath, fileBackupPath);
  }
};

/**
 * @param {BaseAPI} api
 * @param {string} relativePath
 */
module.exports.backupAndDeleteFile = function (api, relativePath) {
  module.exports.backupFile(api, relativePath);
  fs.rmSync(api.resolve.app(relativePath));
};

/**
 * @param {BaseAPI} api
 * @param {string} relativePath
 */
module.exports.restoreFile = function (api, relativePath) {
  const filePath = api.resolve.app(relativePath);
  const fileBackupPath = api.resolve.app(`bk/${relativePath}`);
  const restoreDir = path.dirname(filePath);

  if (fs.existsSync(fileBackupPath)) {
    if (!fs.existsSync(restoreDir)) {
      fs.mkdirSync(restoreDir, { recursive: true });
    }

    fs.copyFileSync(fileBackupPath, filePath);
  }
};
