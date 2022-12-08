const { defineInstall, getExtensionConfig } = require('..');

module.exports = defineInstall(function (api) {
  const config = getExtensionConfig();
  const prompts = config.prompts('vendors');

  /**
   * @type string
   */
  const vendorsConfig = prompts.vendors;
  const vendors = vendorsConfig.split(',');

  // Font Awesome Pro, vue-fontawesome
  if (vendors.includes('fap')) {
    api.render('./templates/dist-fap');

    module.exports.extendPackageJson.dependencies = {
      ...module.exports.extendPackageJson.dependencies,

      '@fortawesome/fontawesome-pro': '^6.2.1',
      '@fortawesome/fontawesome-svg-core': '^6.2.1',
      '@fortawesome/free-brands-svg-icons': '^6.2.1',
      '@fortawesome/pro-duotone-svg-icons': '^6.2.1',
      '@fortawesome/pro-light-svg-icons': '^6.2.1',
      '@fortawesome/pro-regular-svg-icons': '^6.2.1',
      '@fortawesome/pro-solid-svg-icons': '^6.2.1',
      '@fortawesome/vue-fontawesome': '^3.0.2',
    };
  }

  // axios
  if (vendors.includes('axs')) {
    module.exports.extendPackageJson.dependencies = {
      ...module.exports.extendPackageJson.dependencies,

      axios: '^0.26.0',
    };
  }

  // Lodash
  if (vendors.includes('lds')) {
    module.exports.extendPackageJson.dependencies = {
      ...module.exports.extendPackageJson.dependencies,

      lodash: '^4.17.21',
    };

    module.exports.extendPackageJson.devDependencies = {
      ...module.exports.extendPackageJson.devDependencies,

      '@types/lodash': '^4.14.179',
    };
  }

  // js-guid
  if (vendors.includes('jgd')) {
    module.exports.extendPackageJson.dependencies = {
      ...module.exports.extendPackageJson.dependencies,

      'js-guid': '^1.0.0',
    };
  }

  // AutoMapper TypeScript
  if (vendors.includes('atm')) {
    module.exports.extendPackageJson.dependencies = {
      ...module.exports.extendPackageJson.dependencies,

      '@automapper/core': '^7.3.14',
      '@automapper/pojos': '^7.3.14',
    };
  }

  // vee-validate
  if (vendors.includes('vld')) {
    module.exports.extendPackageJson.dependencies = {
      ...module.exports.extendPackageJson.dependencies,

      'vee-validate': '^4.7.3',
      yup: '^0.32.11',
    };
  }

  // markdown-it
  if (vendors.includes('mkd')) {
    module.exports.extendPackageJson.dependencies = {
      ...module.exports.extendPackageJson.dependencies,

      'vue-markdown-render': '^2.0.0',
    };

    module.exports.extendPackageJson.devDependencies = {
      ...module.exports.extendPackageJson.devDependencies,

      '@types/markdown-it': '^12.2.3',
    };
  }
});

module.exports.extendPackageJson = {
  dependencies: {},
  devDependencies: {},
};
