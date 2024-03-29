const fs = require('fs');
const { defineInstall } = require('..');

// Give the function a name to identify the module when replacing prompts from app config in extension wrapper
module.exports = defineInstall(function vendors(api) {
  /**
   * @type string
   */
  const vendorsConfig = api.prompts.vendors;
  const vendors = vendorsConfig.split(',');

  // Font Awesome Pro, vue-fontawesome
  if (vendors.includes('fap')) {
    api.extendPackageJson({
      dependencies: {
        '@fortawesome/fontawesome-pro': '^6.4.0',
        '@fortawesome/fontawesome-svg-core': '^6.4.0',
        '@fortawesome/free-brands-svg-icons': '^6.4.0',
        '@fortawesome/pro-duotone-svg-icons': '^6.4.0',
        '@fortawesome/pro-light-svg-icons': '^6.4.0',
        '@fortawesome/pro-regular-svg-icons': '^6.4.0',
        '@fortawesome/pro-solid-svg-icons': '^6.4.0',
        '@fortawesome/vue-fontawesome': '^3.0.3',
      },
    });
    delete require.cache[api.resolve.app('package.json')];

    api.render('./templates/dist-fap');

    const npmrc = fs.readFileSync(api.resolve.app('.npmrc'), 'utf-8');

    if (!npmrc.includes('@fortawesome:registry')) {
      api.onExitLog(
        ' \x1b[32mvendors       • \x1b[0mFont Awesome registry is absent from \x1b[33m./.npmrc\x1b[0m. Affter adding please also add \x1b[33m.npmrc\x1b[0m to \x1b[33m./.gitignore\x1b[0m.',
      );
    }
  }

  // axios
  if (vendors.includes('axs')) {
    api.extendPackageJson({
      dependencies: {
        axios: '^0.26.0',
      },
    });
    delete require.cache[api.resolve.app('package.json')];
  }

  // Lodash
  if (vendors.includes('lds')) {
    api.extendPackageJson({
      dependencies: {
        lodash: '^4.17.21',
      },
      devDependencies: {
        '@types/lodash': '^4.14.195',
      },
    });
    delete require.cache[api.resolve.app('package.json')];
  }

  // js-guid
  if (vendors.includes('jgd')) {
    api.extendPackageJson({
      dependencies: {
        'js-guid': '^1.0.2',
      },
    });
    delete require.cache[api.resolve.app('package.json')];
  }

  // AutoMapper TypeScript
  if (vendors.includes('atm')) {
    api.extendPackageJson({
      dependencies: {
        '@automapper/core': '^8.7.7',
        '@automapper/pojos': '^8.7.7',
      },
    });
    delete require.cache[api.resolve.app('package.json')];

    api.extendJsonFile('tsconfig.json', {
      skipLibCheck: true,
    });
    delete require.cache[api.resolve.app('tsconfig.json')];
  }

  // vee-validate
  if (vendors.includes('vld')) {
    api.extendPackageJson({
      dependencies: {
        'vee-validate': '^4.10.8',
        yup: '^1.2.0',
      },
    });
    delete require.cache[api.resolve.app('package.json')];
  }

  // markdown-it
  if (vendors.includes('mkd')) {
    api.extendPackageJson({
      dependencies: {
        'vue-markdown-render': '^2.0.1',
      },
      devDependencies: {
        '@types/markdown-it': '^12.2.3',
      },
    });
    delete require.cache[api.resolve.app('package.json')];
  }
});
