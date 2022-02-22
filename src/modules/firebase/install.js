const getExtensionConfig = require('../extension-config')

module.exports = function (api) {
  const config = getExtensionConfig()
  const prompts = config.prompts('firebase')

  api.render('./templates/dist', {
    prompts
  })

  api.renderFile('./templates/dist-files/firebase.txt', 'firebase.json', {
    prompts
  })

  if (api.appDir.endsWith('\\dev')) {
    api.render('./templates/dev')
  }

  api.onExitLog('\x1b[32mfirebase      • \x1b[0mPlease add \x1b[47m\x1b[30m.env\x1b[0m with Firebase config based on \x1b[47m\x1b[30m./env-template.txt\x1b[0m.')

  if (config.hasModule('vite')) {
    api.render('./templates/dist-vite')
    module.exports.extendPackageJson.scripts['dev:q'] = 'cross-env FIREBASE_ENV=DEV quasar dev'
  } else {
    module.exports.extendPackageJson.scripts.dev = 'cross-env FIREBASE_ENV=DEV quasar dev'
  }

  const features = prompts.features.split(',')

  // Authentication
  if (features.includes('aut')) {
    const roles = prompts.userRoles.split(',')
    const userRoles = roles.length > 0 ? `', '${roles.join("', '")}` : ''
    api.render('./templates/dist-aut', {
      userRoles
    })

    api.onExitLog('\x1b[32mfirebase-auth • \x1b[0mPlease add \x1b[33mname: \'MainLayout\'\x1b[0m to \x1b[33mMainLayout.vue\x1b[0m record in \x1b[47m\x1b[30m./src/router/routes.ts\x1b[0m.')
  }

  // Firestore
  if (features.includes('str')) {
    api.render('./templates/dist-str')
  }
}

module.exports.extendPackageJson = {
  scripts: {
    emulators: 'firebase emulators:start',
    'dev:build': 'cross-env FIREBASE_ENV=DEV quasar build',
    'stage:build': 'cross-env FIREBASE_ENV=STAGE quasar build',
    'prod:build': 'cross-env FIREBASE_ENV=PROD quasar build'
  },
  dependencies: {
    firebase: '^9.6.6',
    firebaseui: '^6.0.0'
  },
  devDependencies: {
    dotenv: '^16.0.0',
    'cross-env': '^7.0.3'
  }
}
