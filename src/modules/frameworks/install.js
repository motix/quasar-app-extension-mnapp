const { defineInstall } = require('..');

module.exports = defineInstall(function () {
  //
});

module.exports.extendPackageJson = {
  scripts: {
    clean: 'yarn format && yarn lint --fix',
    'r-mnapp': 'yarn u-mnapp && yarn i-mnapp && yarn clean',
  },

  dependencies: {
    // Upgrade Starter Kit packages
    pinia: '^2.0.12',
    '@quasar/extras': '^1.13.3',
    quasar: '^2.6.1',
    vue: '^3.2.31',
    'vue-router': '^4.0.14',
  },

  devDependencies: {
    // Upgrade Starter Kit packages
    '@typescript-eslint/eslint-plugin': '^5.15.0',
    '@typescript-eslint/parser': '^5.15.0',
    eslint: '^8.11.0',
    'eslint-plugin-vue': '^8.5.0',
    'eslint-config-prettier': '^8.5.0',
    prettier: '^2.6.0',
    '@types/node': '^17.0.21',
    '@quasar/app-vite': '^1.0.0-beta.7',
    autoprefixer: '^10.4.4',
    typescript: '^4.6.2',
  },
};
