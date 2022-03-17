import { config as dotenvConfig } from 'dotenv'

import { UserConfig } from 'vite'

export function defineConfig (config: UserConfig) {
  const env = dotenvConfig({ path: '.env' }).parsed

  if (!env) {
    throw Error('Unable to parse .env.')
  }

  const FIREBASE_ENV = process.env.FIREBASE_ENV

  if (!FIREBASE_ENV || !['DEV', 'STAGE', 'PROD'].includes(FIREBASE_ENV)) {
    throw Error('Unknonw or not supplied Firebase environment variable.')
  }

  const FIREBASE_CONFIG = {
    apiKey: env[`${FIREBASE_ENV}_API_KEY`],
    authDomain: env[`${FIREBASE_ENV}_AUTH_DOMAIN`],
    projectId: env[`${FIREBASE_ENV}_PROJECT_ID`],
    storageBucket: env[`${FIREBASE_ENV}_STORAGE_BUCKET`],
    messagingSenderId: env[`${FIREBASE_ENV}_MESSAGING_SENDER_ID`],
    appId: env[`${FIREBASE_ENV}_APP_ID`],
    measurementId: env[`${FIREBASE_ENV}_MEASUREMENT_ID`]
  }

  const FIREBASE_CLIENT_ID = env[`${FIREBASE_ENV}_CLIENT_ID`]

  if (config.define) {
    const processEnv = config.define['process.env'] as Record<string, unknown>
    processEnv.FIREBASE_ENV = FIREBASE_ENV
    processEnv.FIREBASE_CONFIG = FIREBASE_CONFIG
    processEnv.FIREBASE_CLIENT_ID = FIREBASE_CLIENT_ID
  }
}
