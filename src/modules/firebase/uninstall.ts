import { reduceJsonFile } from '../../lib/json-helpers.js';
import { defineUninstall } from '../index.js';

export default defineUninstall(function (api) {
  api.onExitLog(
    ' \x1b[32mfirebase      • \x1b[0mPlease remove \x1b[47m\x1b[30m./.env\x1b[0m if no longer used.',
  );

  api.removeTemplateTree();
  api.removePath('.firebaserc');
  api.removePath('firebase.json');

  api.extendJsonFile('package.json', {
    scripts: {
      dev: 'quasar dev',
      build: 'quasar build',
      postinstall: 'node fixQuasarAppVite.js && quasar prepare',
    },
  });
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
