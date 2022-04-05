const fs = require('fs');
const { defineIndex, getExtensionConfig } = require('..');

module.exports = defineIndex(function (api) {
  const config = getExtensionConfig();
  const prompts = config.prompts('app-default');

  api.extendQuasarConf((conf, api) => {
    conf.devServer.port = prompts.devServerPort;

    if (prompts.https) {
      conf.devServer.https = {
        key: fs.readFileSync(api.resolve.app('mkcerts/server.key')),
        cert: fs.readFileSync(api.resolve.app('mkcerts/server.crt')),
      };
    }

    if (prompts.dark) {
      conf.framework.config.dark = 'auto';
    }

    conf.build.vueRouterMode = 'history';
    conf.boot.push('notify');
    conf.css.push('app-default.scss');
  });
});
