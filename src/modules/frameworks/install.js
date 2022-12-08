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
    pinia: '^2.0.27',
    '@quasar/extras': '^1.15.7',
    quasar: '^2.10.2',
    vue: '^3.2.45',
    'vue-router': '^4.1.6',
  },

  devDependencies: {
    // Upgrade Starter Kit packages
    '@typescript-eslint/eslint-plugin': '^5.45.1',
    '@typescript-eslint/parser': '^5.45.1',
    eslint: '^8.29.0',
    'eslint-plugin-vue': '^9.8.0',
    'eslint-config-prettier': '^8.5.0',
    prettier: '^2.8.1',
    '@types/node': '^18.11.11',
    '@quasar/app-vite': '^1.1.3',
    autoprefixer: '^10.4.13',
    typescript: '^4.9.3',
  },
};
