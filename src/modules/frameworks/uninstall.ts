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
      vue: '^3.5.22',
      'vue-router': '^5.0.0',
    },

    devDependencies: {
      // Restore Starter Kit packages
      '@eslint/js': '^9.14.0',
      eslint: '^9.14.0',
      'eslint-plugin-vue': '^10.4.0',
      globals: '^16.4.0',
      'vue-tsc': '^3.0.7',
      '@vue/eslint-config-typescript': '^14.4.0',
      'vite-plugin-checker': '^0.11.0',
      'vue-eslint-parser': '^10.2.0',
      '@vue/eslint-config-prettier': '^10.1.0',
      prettier: '^3.3.3',
      '@types/node': '^20.5.9',
      '@quasar/app-vite': '^2.1.0',
      autoprefixer: '^10.4.2',
      typescript: '^5.9.2',
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
