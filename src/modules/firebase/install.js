/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineInstall, getExtensionConfig } = require('..')

module.exports = defineInstall(function (api) {
  const config = getExtensionConfig()
  const prompts = config.prompts('firebase')

  api.render('./templates/dist')

  api.renderFile('./templates/dist-files/firebase.txt', 'firebase.json', {
    prompts
  })

  api.onExitLog('\x1b[32mfirebase      • \x1b[0mPlease add \x1b[47m\x1b[30m.env\x1b[0m with Firebase config based on \x1b[47m\x1b[30m./env-template.txt\x1b[0m.')

  if (config.hasModule('vite')) {
    api.render('./templates/dist-vite')
    module.exports.extendPackageJson.scripts.dev = 'cross-env FIREBASE_ENV=DEV vite'
    module.exports.extendPackageJson.scripts['dev:q'] = 'cross-env FIREBASE_ENV=DEV quasar dev'
  } else {
    module.exports.extendPackageJson.scripts.dev = 'cross-env FIREBASE_ENV=DEV quasar dev'
  }
})

module.exports.extendPackageJson = {
  scripts: {
    emulators: 'firebase emulators:start',
    'dev:build': 'cross-env FIREBASE_ENV=DEV quasar build',
    'stage:build': 'cross-env FIREBASE_ENV=STAGE quasar build',
    'prod:build': 'cross-env FIREBASE_ENV=PROD quasar build'
  },
  dependencies: {
    firebase: '^9.6.8'
  },
  devDependencies: {
    dotenv: '^16.0.0',
    'cross-env': '^7.0.3'
  }
}
