module.exports = function (api) {
  api.render('./templates/dist')

  if (api.appDir.endsWith('\\dev')) {
    api.render('./templates/dev')
  }
}

module.exports.extendPackageJson = {
  dependencies: {
    // Fontawesome Pro, vue-fontawesome
    '@fortawesome/fontawesome-pro': '^5.15.3',
    '@fortawesome/fontawesome-svg-core': '^1.2.35',
    '@fortawesome/free-brands-svg-icons': '^5.15.3',
    '@fortawesome/pro-duotone-svg-icons': '^5.15.3',
    '@fortawesome/pro-light-svg-icons': '^5.15.3',
    '@fortawesome/pro-regular-svg-icons': '^5.15.3',
    '@fortawesome/pro-solid-svg-icons': '^5.15.3',
    '@fortawesome/vue-fontawesome': '^2.0.2',

    // axios
    axios: '^0.21.1',

    // Lodash
    lodash: '^4.17.21',

    // Vuelidate
    '@vuelidate/core': '^2.0.0-alpha.14',
    '@vuelidate/validators': '^2.0.0-alpha.12',

    // json-tree-view-vue3
    'json-tree-view-vue3': '^0.1.14'
  },

  devDependencies: {
    // Lodash
    '@types/lodash': '^4.14.168'
  }
}
