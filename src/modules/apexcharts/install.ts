import { defineInstall } from '../index.js';

export default defineInstall(function (api) {
  api.extendPackageJson({
    dependencies: {
      apexcharts: '^5.10.4',
      'vue3-apexcharts': '^1.11.1',
    },
  });

  api.renderTemplate();
});
