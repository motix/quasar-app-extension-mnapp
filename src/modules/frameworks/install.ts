import fs from 'fs';

import { defineInstall } from '../index.js';
import { packagesLatestVersion } from './packages-version.js';

export default defineInstall(function (api) {
  const dependencies: (keyof typeof packagesLatestVersion)[] = [
    // Upgrade Starter Kit packages
    '@quasar/extras',
    'pinia',
    'quasar',
    'vue',
    'vue-router',

    // Additional packages
    'vue-component-type-helpers',
  ];

  const devDependencies: (keyof typeof packagesLatestVersion)[] = [
    // Upgrade Starter Kit packages
    '@eslint/js',
    // '@quasar/app-vite' -> Maybe patched by `quasar-generate`, check before upgrade
    '@types/node',
    '@vue/eslint-config-prettier',
    '@vue/eslint-config-typescript',
    'autoprefixer',
    'eslint',
    'eslint-plugin-vue',
    'globals',
    'prettier',
    'typescript',
    // 'vite-plugin-checker' -> Patched by `quasar-generate`, use `quasar-generate` to upgrade
    'vue-eslint-parser',
    'vue-tsc',

    // Upgrade `quasar-generate` packages
    // '@trivago/prettier-plugin-sort-imports' -> Patched by `quasar-generate`, use `quasar-generate` to upgrade
    '@vue/compiler-sfc',
    'postcss',
    'vite',
  ];

  const packageJson = fs.readFileSync(api.resolve.app('package.json'), 'utf-8');

  if (!packageJson.includes('"@quasar/app-vite": "patch')) {
    devDependencies.push('@quasar/app-vite');
  }

  api.extendPackageJson({
    dependencies: Object.fromEntries(
      dependencies.map((item) => [item, packagesLatestVersion[item]]),
    ),
    devDependencies: Object.fromEntries(
      devDependencies.map((item) => [item, packagesLatestVersion[item]]),
    ),
  });
});
