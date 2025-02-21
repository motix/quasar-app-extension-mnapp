import { reduceJsonFile } from '../../lib/json-helpers.js';
import { defineUninstall } from '../index.js';

export default defineUninstall(function (api) {
  api.removeTemplateTree('dist', {
    knownPaths: ['src/models/firebase-auth', 'src/pages/auth'],
  });

  api.onExitLog(
    " \x1b[32mfirebase-auth • \x1b[0mPlease remove \x1b[33mname: 'MainLayout'\x1b[0m from \x1b[33mMainLayout.vue\x1b[0m record in \x1b[47m\x1b[30m./src/router/routes.ts\x1b[0m if not needed anymore.",
  );

  reduceJsonFile(api, 'package.json', ['dependencies.firebaseui']);
});
