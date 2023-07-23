const { reduceJsonFile } = require('../../lib/json-helpers');
const { defineUninstall } = require('..');

// Give the function a name to identify the module when replacing prompts from app config in extension wrapper
module.exports = defineUninstall(function firebaseAuth(api) {
  api.removePath('src/boot/firebase-auth.ts');
  api.removePath('src/composables/useFirebaseAuth.ts');
  api.removePath('src/models/firebase-auth');
  api.removePath('src/pages/auth');
  api.removePath('src/services/firebase-auth.ts');
  api.removePath('src/stores/FirebaseAuth.ts');
  api.removePath('src/types/firebase-auth.d.ts');

  api.onExitLog(
    " \x1b[32mfirebase-auth • \x1b[0mPlease remove \x1b[33mname: 'MainLayout'\x1b[0m from \x1b[33mMainLayout.vue\x1b[0m record in \x1b[47m\x1b[30m./src/router/routes.ts\x1b[0m if not needed anymore.",
  );

  reduceJsonFile(api, 'package.json', ['dependencies.firebaseui']);
});
