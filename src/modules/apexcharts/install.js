const { defineInstall } = require('..');

module.exports = defineInstall(function (api) {
  api.extendPackageJson({
    dependencies: {
      apexcharts: '^3.41.0',
      'vue3-apexcharts': '^1.4.4',
    },
  });
  delete require.cache[api.resolve.app('package.json')];

  api.render('./templates/dist');
});
