const { defineInstall } = require('..');

module.exports = defineInstall(function () {
  //
});

module.exports.extendJsonFiles = {
  'tsconfig.json': {
    compilerOptions: {
      paths: {
        'utils/*': ['src/utils/*'],
        'models/*': ['src/models/*'],
        'api/*': ['src/api/*'],
        'services/*': ['src/services/*'],
        'composables/*': ['src/composables/*'],
      },
    },
  },
};
