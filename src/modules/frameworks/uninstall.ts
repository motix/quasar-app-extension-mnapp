import { reduceJsonFile, reduceJsonFileArray } from '../../lib/json-helpers.js';
import { defineUninstall } from '../index.js';

export default defineUninstall(function (api) {
  modifyFiles();

  api.extendJsonFile('package.json', {
    dependencies: {
      // Restore Starter Kit packages
      pinia: '^3.0.1',
      '@quasar/extras': '^1.16.4',
      quasar: '^2.16.0',
      vue: '^3.4.18',
      'vue-router': '^4.0.12',
    },

    devDependencies: {
      // Restore Starter Kit packages
      '@eslint/js': '^9.14.0',
      eslint: '^9.14.0',
      'eslint-plugin-vue': '^9.30.0',
      globals: '^15.12.0',
      'vue-tsc': '^2.0.29',
      '@vue/eslint-config-typescript': '^14.1.3',
      'vite-plugin-checker': '^0.8.0',
      '@vue/eslint-config-prettier': '^10.1.0',
      prettier: '^3.3.3',
      '@types/node': '^20.5.9',
      '@quasar/app-vite': '^2.1.0',
      autoprefixer: '^10.4.2',
      typescript: '~5.5.3',
    },
  });

  reduceJsonFile(api, 'package.json', ['dependencies.vue-component-type-helpers']);

  function modifyFiles() {
    // [Reverse] Modify tsconfig.json

    reduceJsonFileArray(api, 'tsconfig.json', [{ path: 'exclude', value: '.bk' }], ['exclude']);

    // [Reverse] Modify `.vscode/extensions.json`.

    reduceJsonFileArray(api, '.vscode/extensions.json', [
      { path: 'recommendations', value: 'aaron-bond.better-comments' },
    ]);
  }
});
