const { reduceJsonFile } = require('../../lib/json-helpers');
const { defineUninstall } = require('..');

module.exports = defineUninstall(function (api) {
  api.removePath('src/boot/apexcharts.ts');
  api.removePath('src/components/shared/ToggleChartsViewButton.vue');
  api.removePath('src/composables/useCharts.ts');
  api.removePath('src/types/VueApexCharts.d.ts');

  reduceJsonFile(api, 'package.json', [
    'dependencies.apexcharts',
    'dependencies.vue3-apexcharts',
  ]);
});
