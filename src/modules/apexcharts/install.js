const { defineInstall } = require('..');

module.exports = defineInstall(function (api) {
  api.extendPackageJson({
    dependencies: {
      apexcharts: '^3.40.0',
      'vue3-apexcharts': '^1.4.1',
    },
  });
  delete require.cache[api.resolve.app('package.json')];

  api.render('./templates/dist');
});
