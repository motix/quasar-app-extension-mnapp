module.exports = function (api) {
  api.render('./templates/dist')

  if (api.appDir.endsWith('\\dev')) {
    api.render('./templates/dev')
  }
}

module.exports.extendPackageJson = {
  dependencies: {
    // Upgrade Starter Kit packages
    '@quasar/extras': '^1.9.19',
    'core-js': '^3.9.1',
    quasar: '^2.0.0-beta.9'
  },

  devDependencies: {
    // Upgrade Starter Kit packages
    '@quasar/app': '^3.0.0-beta.9',
    '@types/node': '^14.14.35',

    // module.hot
    '@types/webpack-env': '^1.16.0'
  }
}
