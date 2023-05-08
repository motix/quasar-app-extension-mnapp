const { defineInstall } = require('..');

module.exports = defineInstall(function (api) {
  api.extendPackageJson({
    scripts: {
      clean: 'yarn format && yarn lint --fix',
      'r-mnapp': 'yarn u-mnapp && yarn i-mnapp && yarn clean',
    },

    dependencies: {
      // Upgrade Starter Kit packages
      pinia: '^2.0.35',
      '@quasar/extras': '^1.16.3',
      quasar: '^2.12.0',
      vue: '^3.2.47',
      'vue-router': '^4.1.6',
    },

    devDependencies: {
      // Upgrade Starter Kit packages
      '@typescript-eslint/eslint-plugin': '^5.59.2',
      '@typescript-eslint/parser': '^5.59.2',
      eslint: '^8.39.0',
      'eslint-plugin-vue': '^9.11.0',
      'eslint-config-prettier': '^8.8.0',
      prettier: '^2.8.8',
      '@types/node': '^20.0.0',
      '@quasar/app-vite': '^1.3.0',
      autoprefixer: '^10.4.14',
      typescript: '^5.0.4',
    },
  });
  delete require.cache[api.resolve.app('package.json')];
});
