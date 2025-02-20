const { config } = require('dotenv');
const { defineIndex } = require('..');

// Give the function a name to identify the module when replacing prompts from app config in extension wrapper
module.exports = defineIndex(function firebase(api) {
  api.extendQuasarConf((conf) => {
    conf.boot.push('firebase');

    const configPath = api.resolve.app('.env');
    const env = config({ path: configPath }).parsed;
    const FIREBASE_ENV = process.env.FIREBASE_ENV;

    if (!env) {
      throw Error('.env not found.');
    }

    if (!FIREBASE_ENV || !['DEV', 'STAGE', 'PROD'].includes(FIREBASE_ENV)) {
      throw Error('Unknonw or not supplied Firebase environment variable.');
    }

    const FIREBASE_CONFIG = {
      apiKey: env[`${FIREBASE_ENV}_API_KEY`],
      authDomain: env[`${FIREBASE_ENV}_AUTH_DOMAIN`],
      projectId: env[`${FIREBASE_ENV}_PROJECT_ID`],
      storageBucket: env[`${FIREBASE_ENV}_STORAGE_BUCKET`],
      messagingSenderId: env[`${FIREBASE_ENV}_MESSAGING_SENDER_ID`],
      appId: env[`${FIREBASE_ENV}_APP_ID`],
      measurementId: env[`${FIREBASE_ENV}_MEASUREMENT_ID`],
    };

    const FIREBASE_CLIENT_ID = env[`${FIREBASE_ENV}_CLIENT_ID`];

    conf.build.env = {
      ...conf.build.env,
      FIREBASE_ENV,
      FIREBASE_CONFIG: JSON.stringify(FIREBASE_CONFIG),
      FIREBASE_CLIENT_ID,
    };
  });
});
