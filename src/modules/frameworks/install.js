/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineInstall, getExtensionConfig } = require('..')

module.exports = defineInstall(function () {
  const config = getExtensionConfig()
  const prompts = config.prompts('frameworks')

  if (prompts.vuex) {
    module.exports.extendPackageJson.dependencies = {
      ...module.exports.extendPackageJson.dependencies,

      // Upgrade Starter Kit packages
      vuex: '^4.0.2'
    }

    module.exports.extendPackageJson.devDependencies = {
      ...module.exports.extendPackageJson.devDependencies,

      // module.hot
      '@types/webpack-env': '^1.16.3'
    }
  }
})

module.exports.extendPackageJson = {
  dependencies: {
    // Upgrade Starter Kit packages
    '@quasar/extras': '^1.13.0',
    'core-js': '^3.21.1',
    quasar: '^2.5.5',
    vue: '^3.2.31',
    'vue-router': '^4.0.13'
  },

  devDependencies: {
    // Upgrade Starter Kit packages
    '@babel/eslint-parser': '^7.17.0',
    '@quasar/app': '^3.3.3',
    '@types/node': '^17.0.21',
    '@typescript-eslint/eslint-plugin': '^5.14.0',
    '@typescript-eslint/parser': '^5.14.0',
    eslint: '^8.10.0',
    'eslint-config-standard': '^16.0.3',
    'eslint-plugin-import': '^2.25.4',
    'eslint-plugin-node': '^11.1.0',
    'eslint-plugin-promise': '^6.0.0',
    'eslint-plugin-vue': '^8.5.0'
  }
}
