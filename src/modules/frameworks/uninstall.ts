import { reduceJsonFile, reduceJsonFileArray } from '../../lib/json-helpers.js';
import { defineUninstall } from '../index.js';
import { packagesOriginalVersion } from './packages-version.js';

export default defineUninstall(function (api) {
  modifyFiles();

  const dependencies: (keyof typeof packagesOriginalVersion)[] = [
    // Restore Starter Kit packages
    'pinia',
    '@quasar/extras',
    'quasar',
    'vue',
    'vue-router',
  ];

  const devDependencies: (keyof typeof packagesOriginalVersion)[] = [
    // Restore Starter Kit packages
    '@eslint/js',
    'eslint',
    'eslint-plugin-vue',
    'globals',
    'vue-tsc',
    '@vue/eslint-config-typescript',
    'vite-plugin-checker',
    'vue-eslint-parser',
    '@vue/eslint-config-prettier',
    'prettier',
    '@types/node',
    '@quasar/app-vite',
    'autoprefixer',
    'typescript',
  ];

  api.extendJsonFile('package.json', {
    dependencies: Object.fromEntries(
      dependencies.map((item) => [item, packagesOriginalVersion[item]]),
    ),
    devDependencies: Object.fromEntries(
      devDependencies.map((item) => [item, packagesOriginalVersion[item]]),
    ),
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
