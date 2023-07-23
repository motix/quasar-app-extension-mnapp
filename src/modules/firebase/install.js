const { reduceJsonFile } = require('../../lib/json-helpers');
const { defineInstall } = require('..');

// Give the function a name to identify the module when replacing prompts from app config in extension wrapper
module.exports = defineInstall(function firebase(api) {
  reduceJsonFile(api, 'package.json', ['scripts.dev', 'scripts.build']);
  api.extendPackageJson({
    scripts: {
      dev: 'cross-env FIREBASE_ENV=DEV quasar dev',
      'dev:build': 'cross-env FIREBASE_ENV=DEV quasar build',
      'stage:build': 'cross-env FIREBASE_ENV=STAGE quasar build',
      'prod:build': 'cross-env FIREBASE_ENV=PROD quasar build',
      'dev:deploy': 'yarn dev:build && firebase deploy',
      'stage:deploy': 'yarn stage:build && firebase deploy',
      'prod:deploy': 'yarn prod:build && firebase deploy',
      'prod:deploy:debug': 'yarn prod:build --debug && firebase deploy',
    },
    dependencies: {
      firebase: '^10.1.0',
    },
    devDependencies: {
      'cross-env': '^7.0.3',
    },
  });
  delete require.cache[api.resolve.app('package.json')];

  api.render('./templates/dist');

  api.renderFile('./templates/dist-files/firebaserc.txt', '.firebaserc', {
    prompts: api.prompts,
  });
  api.renderFile('./templates/dist-files/firebase.txt', 'firebase.json', {
    prompts: api.prompts,
  });

  api.onExitLog(
    ' \x1b[32mfirebase      • \x1b[0mPlease add \x1b[47m\x1b[30m.env\x1b[0m with Firebase config based on \x1b[47m\x1b[30m./firebase-env-template.txt\x1b[0m.'
  );
});
