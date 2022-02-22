const getExtensionConfig = require('../extension-config')

module.exports = function (api) {
  const config = getExtensionConfig()
  const prompts = config.prompts('vendors')

  api.render('./templates/dist')

  if (api.appDir.endsWith('\\dev')) {
    api.render('./templates/dev')
  }

  // TODO:: Check unused vendors

  const vendors = prompts.vendors.split(',')

  // axios
  if (vendors.includes('pin')) {
    module.exports.extendPackageJson.dependencies = {
      ...module.exports.extendPackageJson.dependencies,

      pinia: '^2.0.11'
    }
  }

  // Font Awesome Pro, vue-fontawesome
  if (vendors.includes('fap')) {
    api.render('./templates/dist-fap')

    module.exports.extendPackageJson.dependencies = {
      ...module.exports.extendPackageJson.dependencies,

      '@fortawesome/fontawesome-pro': '^6.0.0',
      '@fortawesome/fontawesome-svg-core': '^1.3.0',
      '@fortawesome/free-brands-svg-icons': '^6.0.0',
      '@fortawesome/pro-duotone-svg-icons': '^6.0.0',
      '@fortawesome/pro-light-svg-icons': '^6.0.0',
      '@fortawesome/pro-regular-svg-icons': '^6.0.0',
      '@fortawesome/pro-solid-svg-icons': '^6.0.0',
      '@fortawesome/vue-fontawesome': '^3.0.0-5'
    }
  }

  // axios
  if (vendors.includes('axs')) {
    module.exports.extendPackageJson.dependencies = {
      ...module.exports.extendPackageJson.dependencies,

      axios: '^0.24.0'
    }
  }

  // Lodash
  if (vendors.includes('lds')) {
    module.exports.extendPackageJson.dependencies = {
      ...module.exports.extendPackageJson.dependencies,

      lodash: '^4.17.21'
    }

    module.exports.extendPackageJson.devDependencies = {
      ...module.exports.extendPackageJson.devDependencies,

      '@types/lodash': '^4.14.178'
    }
  }

  // js-guid
  if (vendors.includes('jgd')) {
    module.exports.extendPackageJson.dependencies = {
      ...module.exports.extendPackageJson.dependencies,

      'js-guid': '^1.0.0'
    }
  }

  // AutoMapper TypeScript
  if (vendors.includes('atm')) {
    module.exports.extendPackageJson.dependencies = {
      ...module.exports.extendPackageJson.dependencies,

      '@automapper/core': '^7.2.1',
      '@automapper/pojos': '^7.2.1'
    }
  }

  // vee-validate
  if (vendors.includes('vld')) {
    module.exports.extendPackageJson.dependencies = {
      ...module.exports.extendPackageJson.dependencies,

      'vee-validate': '^4.5.8',
      yup: '^0.32.11'
    }
  }

  // markdown-it
  if (vendors.includes('mkd')) {
    module.exports.extendPackageJson.dependencies = {
      ...module.exports.extendPackageJson.dependencies,

      'vue-markdown-render': '^2.0.0'
    }

    module.exports.extendPackageJson.devDependencies = {
      ...module.exports.extendPackageJson.devDependencies,

      '@types/markdown-it': '^12.2.3'
    }
  }

  // json-tree-view-vue3
  if (vendors.includes('jtv')) {
    module.exports.extendPackageJson.dependencies = {
      ...module.exports.extendPackageJson.dependencies,

      'json-tree-view-vue3': '^0.1.16'
    }
  }
}

module.exports.extendPackageJson = {
  dependencies: {},
  devDependencies: {}
}
