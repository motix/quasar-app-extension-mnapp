const { config } = require('dotenv');
const { defineIndex } = require('..');

module.exports = defineIndex(function (api) {
  api.extendQuasarConf((conf) => {
    conf.boot.push('slack');

    const configPath = api.resolve.app('.env');
    const env = config({ path: configPath }).parsed;

    const SLACK_ACCESS_TOKEN = env['SLACK_ACCESS_TOKEN'];

    conf.build.env = {
      ...conf.build.env,
      SLACK_ACCESS_TOKEN,
    };
  });
});
