const { defineUninstall } = require('..');

module.exports = defineUninstall(function (api) {
  api.removePath('src/boot/firebase-firestore.ts');
  api.removePath('src/models/firebase-firestore');
  api.removePath('src/services/firebase-firestore');
  api.removePath('src/stores/firebase-firestore');
  api.removePath('src/types/firebase-firestore.d.ts');
});
