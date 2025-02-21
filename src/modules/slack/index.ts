import { config } from 'dotenv';

import { defineIndex } from '../index.js';

export default defineIndex(function (api) {
  api.extendQuasarConf((conf) => {
    const configPath = api.resolve.app('.env');
    const env = config({ path: configPath }).parsed;

    if (!env) {
      throw Error('.env not found.');
    }

    const SLACK_ACCESS_TOKEN = env['SLACK_ACCESS_TOKEN'];

    conf.build!.env = {
      ...conf.build!.env,
      SLACK_ACCESS_TOKEN,
    };
  });
});
