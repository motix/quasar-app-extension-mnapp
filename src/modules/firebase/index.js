const getExtensionConfig = require('../extension-config')

module.exports = function (api) {
  const config = getExtensionConfig()
  const prompts = config.prompts('firebase')

  api.extendQuasarConf((conf) => {
    conf.boot.push('firebase')

    const dotenvPath = api.resolve.app('node_modules/dotenv')
    const dotenvConfigPath = api.resolve.app('.env')
    const env = require(dotenvPath).config({ path: dotenvConfigPath }).parsed
    const FIREBASE_ENV = process.env.FIREBASE_ENV

    if (!['DEV', 'STAGE', 'PROD'].includes(FIREBASE_ENV)) {
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

    conf.build.env = {
      ...conf.build.env,
      FIREBASE_ENV,
      FIREBASE_CONFIG,
      FIREBASE_CLIENT_ID
    }
  })

  const features = prompts.features.split(',')

  // Authentication
  if (features.includes('aut')) {
    api.extendQuasarConf((conf) => {
      conf.boot.push('firebase-auth')
    })
  }

  // Firestore
  if (features.includes('str')) {
    api.extendQuasarConf((conf) => {
      conf.boot.push('firebase-firestore')
    })
  }
}
