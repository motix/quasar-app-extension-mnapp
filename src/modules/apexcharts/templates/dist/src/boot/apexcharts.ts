import VueApexCharts from 'vue3-apexcharts';

import { boot } from 'quasar/wrappers';

export default boot(({ app }) => {
  app.component('ApexCharts', VueApexCharts);
});
