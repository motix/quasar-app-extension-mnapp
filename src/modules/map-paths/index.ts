import { defineIndex } from '../index.js';

export default defineIndex(function (api) {
  api.extendViteConf((conf) => {
    Object.assign(conf.resolve!.alias!, {
      utils: api.resolve.src('utils'),
      models: api.resolve.src('models'),
      api: api.resolve.src('api'),
      services: api.resolve.src('services'),
      composables: api.resolve.src('composables'),
    });
  });
});
