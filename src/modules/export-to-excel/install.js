const { defineInstall } = require('..');

module.exports = defineInstall(function (api) {
  api.render('./templates/dist');
});

module.exports.extendPackageJson = {
  dependencies: {
    exceljs: '^4.3.0',
    'file-saver': '^2.0.5',
  },
  devDependencies: {
    '@types/file-saver': '^2.0.5',
  },
};
