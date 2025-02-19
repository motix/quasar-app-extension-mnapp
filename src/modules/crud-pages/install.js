const { defineInstall } = require('..');

module.exports = defineInstall(function (api) {
  api.extendPackageJson({
    dependencies: {
      'type-fest': '4.0.0', // Use the exact version that `vee-validate` is using
    },
  });
  delete require.cache[api.resolve.app('package.json')];

  api.render('./templates/dist');
});
