const { defineInstall } = require('..');

module.exports = defineInstall(function (api) {
  api.render('./templates/dist');
});

module.exports.extendPackageJson = {
  dependencies: {
    apexcharts: '^3.36.3',
    'vue3-apexcharts': '^1.4.1',
  },
};
