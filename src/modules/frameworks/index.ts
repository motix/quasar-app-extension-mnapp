import { defineIndex } from '../index.js';

export default defineIndex(function (api) {
  api.extendQuasarConf((conf) => {
    conf.framework!.plugins!.push('Meta', 'Notify', 'Dialog');
    conf.build!.typescript!.vueShim = false;
  });
});
