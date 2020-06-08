module.exports = function (api) {
  // font, primary color
  // notify, Fontawesome Pro, axios, Lodash, Vue JSON Tree View
  // app
  // formats
  api.render('./templates')
}

module.exports.extendPackageJson = {
  dependencies: {
    // Upgrade Starter Kit packages
    '@quasar/extras': '^1.8.2',
    '@vue/composition-api': '^0.5.0',
    quasar: '^1.12.3',

    // Fontawesome Pro, vue-fontawesome
    '@fortawesome/fontawesome-pro': '^5.13.0',
    '@fortawesome/fontawesome-svg-core': '^1.2.28',
    '@fortawesome/free-brands-svg-icons': '^5.13.0',
    '@fortawesome/pro-duotone-svg-icons': '^5.13.0',
    '@fortawesome/pro-light-svg-icons': '^5.13.0',
    '@fortawesome/pro-regular-svg-icons': '^5.13.0',
    '@fortawesome/pro-solid-svg-icons': '^5.13.0',
    '@fortawesome/vue-fontawesome': '^0.1.9',

    // axios
    axios: '^0.19.2',

    // Lodash
    lodash: '^4.17.15',

    // Vuelidate
    vuelidate: '^0.7.5',

    // Vue JSON Tree View
    'vue-json-tree-view': '^2.1.6'
  },

  devDependencies: {
    // Upgrade Starter Kit packages
    '@quasar/app': '^1.9.6',
    '@types/node': '^14.0.11',

    // Lodash
    '@types/lodash': '^4.14.155',

    // Vuelidate
    '@types/vuelidate': '^0.7.13',

    // module.hot
    '@types/webpack-env': '^1.15.2'
  },

  resolutions: {
    '@babel/parser': '7.10.2'
  }
}

module.exports.extendJsonFiles = {
  // tsconfig.json
  'tsconfig.json': {
    extends: './tsconfig-preset'
  }
}
