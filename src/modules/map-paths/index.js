const { defineIndex } = require('..');

module.exports = defineIndex(function (api) {
  api.extendQuasarConf((conf) => {
    conf.build.extendViteConf = (viteConf) => {
      Object.assign(viteConf.resolve.alias, {
        utils: api.resolve.src('utils'),
        models: api.resolve.src('models'),
        api: api.resolve.src('api'),
        services: api.resolve.src('services'),
        composables: api.resolve.src('composables'),
      });
    };
  });
});
