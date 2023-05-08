const { reduceJsonFile } = require('../../lib/json-helpers');
const { defineUninstall } = require('..');

module.exports = defineUninstall(function (api) {
  reduceJsonFile(api, 'package.json', ['scripts.clean']);

  api.extendJsonFile('package.json', {
    scripts: {
      'r-mnapp': 'yarn u-mnapp && yarn i-mnapp',
    },

    dependencies: {
      // Restore Starter Kit packages
      pinia: '^2.0.11',
      '@quasar/extras': '^1.0.0',
      quasar: '^2.6.0',
      vue: '^3.0.0',
      'vue-router': '^4.0.0',
    },

    devDependencies: {
      // Restore Starter Kit packages
      '@typescript-eslint/eslint-plugin': '^5.10.0',
      '@typescript-eslint/parser': '^5.10.0',
      eslint: '^8.10.0',
      'eslint-plugin-vue': '^9.0.0',
      'eslint-config-prettier': '^8.1.0',
      prettier: '^2.5.1',
      '@types/node': '^12.20.21',
      '@quasar/app-vite': '^1.0.0',
      autoprefixer: '^10.4.2',
      typescript: '^4.5.4',
    },
  });
  delete require.cache[api.resolve.app('package.json')];
});
