const fs = require('fs');
const { defineIndex } = require('..');

// Give the function a name to identify the module when replacing prompts from app config in extension wrapper
module.exports = defineIndex(function appDefault(api) {
  api.extendQuasarConf((conf, api) => {
    conf.devServer.port = api.prompts.devServerPort;

    if (api.prompts.https) {
      conf.devServer.https = {
        key: fs.readFileSync(api.resolve.app('mkcerts/server.key')),
        cert: fs.readFileSync(api.resolve.app('mkcerts/server.crt')),
      };
    }

    if (api.prompts.dark) {
      conf.framework.config.dark = 'auto';
    }

    conf.build.vueRouterMode = 'history';
    conf.boot.push('notify');
    conf.css.push('app-default.scss');
  });
});
