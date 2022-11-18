const { defineInstall } = require('..');

module.exports = defineInstall(function () {
  //
});

module.exports.extendJsonFiles = {
  'tsconfig.json': {
    compilerOptions: {
      paths: {
        'src/*': ['src/*'],
        'app/*': ['*'],
        'components/*': ['src/components/*'],
        'layouts/*': ['src/layouts/*'],
        'pages/*': ['src/pages/*'],
        'assets/*': ['src/assets/*'],
        'boot/*': ['src/boot/*'],
        'stores/*': ['src/stores/*'],
        'utils/*': ['src/utils/*'],
        'models/*': ['src/models/*'],
        'api/*': ['src/api/*'],
        'services/*': ['src/services/*'],
        'composables/*': ['src/composables/*'],
      },
    },
  },
};
