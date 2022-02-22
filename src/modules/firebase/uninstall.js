module.exports = function (api) {
  api.removePath('env-template.txt')
  api.removePath('firebase.json')
  api.removePath('.mnapp-vite/firebase.ts')
  api.removePath('.mnapp-vite/firebase.d.ts')
  api.removePath('src/firebase.d.ts')
  api.removePath('src/boot/firebase.ts')
  api.removePath('src/services/firebase.ts')

  api.onExitLog('\x1b[32mfirebase      • \x1b[0mPlease remove \x1b[47m\x1b[30m./.env\x1b[0m if no longer used.')

  // Authentication
  api.removePath('src/firebase-auth.d.ts')
  api.removePath('src/boot/firebase-auth.ts')
  api.removePath('src/models/firebase-auth')
  api.removePath('src/services/firebase-auth.ts')
  api.removePath('src/stores/FirebaseAuth.ts')
  api.removePath('src/composables/useFirebaseAuth.ts')
  api.removePath('src/pages/auth')

  // Firestore
  api.removePath('src/firebase-firestore.d.ts')
  api.removePath('src/boot/firebase-firestore.ts')
  api.removePath('src/services/firebase-firestore')

  api.onExitLog('\x1b[32mfirebase-auth • \x1b[0mPlease remove \x1b[33mname: \'MainLayout\'\x1b[0m from \x1b[33mMainLayout.vue\x1b[0m record in \x1b[47m\x1b[30m./src/router/routes.ts\x1b[0m if not needed anymore.')
}

module.exports.revertFiles = [
  'package.json'
]
