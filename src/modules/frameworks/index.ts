import { defineIndex } from '../index.js';

export default defineIndex(function (api) {
  api.extendQuasarConf((conf) => {
    conf.framework!.plugins!.push('Meta', 'Notify', 'Dialog');
    conf.build!.typescript!.extendTsConfig = (tsConfig) => {
      conf.build!.typescript!.extendTsConfig?.(tsConfig);
      tsConfig.exclude?.push('./../.bk');
    };
    conf.build!.typescript!.vueShim = false;
  });
});
