const { defineInstall } = require('..');

module.exports = defineInstall(function (api) {
  api.extendPackageJson({
    dependencies: {
      exceljs: '^4.3.0',
      'file-saver': '^2.0.5',
    },
    devDependencies: {
      '@types/file-saver': '^2.0.5',
    },
  });
  delete require.cache[api.resolve.app('package.json')];

  api.render('./templates/dist');
});
