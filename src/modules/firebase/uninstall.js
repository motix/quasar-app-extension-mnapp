const { reduceJsonFile } = require('../../lib/json-helpers');
const { defineUninstall } = require('..');

// Give the function a name to identify the module when replacing prompts from app config in extension wrapper
module.exports = defineUninstall(function firebase(api) {
  api.onExitLog(
    ' \x1b[32mfirebase      • \x1b[0mPlease remove \x1b[47m\x1b[30m./.env\x1b[0m if no longer used.',
  );

  api.removePath('.firebaserc');
  api.removePath('firebase-env-template.txt');
  api.removePath('firebase.json');
  api.removePath('src/boot/firebase.ts');
  api.removePath('src/services/firebase.ts');
  api.removePath('src/types/firebase.d.ts');

  api.extendJsonFile('package.json', {
    scripts: {
      dev: 'quasar dev',
      build: 'quasar build',
    },
  });
  delete require.cache[api.resolve.app('package.json')];
  reduceJsonFile(api, 'package.json', [
    'scripts.dev:build',
    'scripts.stage:build',
    'scripts.prod:build',
    'scripts.dev:deploy',
    'scripts.stage:deploy',
    'scripts.prod:deploy',
    'scripts.prod:deploy:debug',
    'dependencies.firebase',
    'devDependencies.cross-env',
  ]);
});
