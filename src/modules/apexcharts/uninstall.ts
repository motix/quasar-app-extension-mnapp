import { reduceJsonFile } from '../../lib/json-helpers.js';
import { defineUninstall } from '../index.js';

export default defineUninstall(function (api) {
  api.removeTemplateTree();

  reduceJsonFile(api, 'package.json', ['dependencies.apexcharts', 'dependencies.vue3-apexcharts']);
});
