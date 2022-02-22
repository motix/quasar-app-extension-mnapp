const getExtensionConfig = require('../extension-config')

module.exports = function (api) {
  const config = getExtensionConfig()
  const prompts = config.prompts('frameworks')

  api.render('./templates/dist')

  if (api.appDir.endsWith('\\dev')) {
    api.render('./templates/dev')
  }

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
}

module.exports.extendPackageJson = {
  dependencies: {
    // Upgrade Starter Kit packages
    '@quasar/extras': '^1.12.5',
    'core-js': '^3.21.0',
    quasar: '^2.5.5',
    vue: '^3.2.30',
    'vue-router': '^4.0.12'
  },

  devDependencies: {
    // Upgrade Starter Kit packages
    '@babel/eslint-parser': '^7.17.0',
    '@quasar/app': '^3.3.3',
    '@types/node': '^17.0.17',
    '@typescript-eslint/eslint-plugin': '^5.10.0',
    '@typescript-eslint/parser': '^5.10.0',
    eslint: '^8.8.0',
    'eslint-config-standard': '^16.0.2',
    'eslint-plugin-import': '^2.19.1',
    'eslint-plugin-node': '^11.0.0',
    'eslint-plugin-promise': '^6.0.0',
    'eslint-plugin-vue': '^8.4.1'
  }
}
