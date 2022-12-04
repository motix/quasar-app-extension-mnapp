const { defineUninstall } = require('..');

module.exports = defineUninstall(function (api) {
  api.removePath('.firebaserc');
  api.removePath('firebase-env-template.txt');
  api.removePath('firebase.json');
  api.removePath('src/boot/firebase.ts');
  api.removePath('src/services/firebase.ts');
  api.removePath('src/types/firebase.d.ts');

  api.onExitLog(
    '\x1b[32mfirebase      • \x1b[0mPlease remove \x1b[47m\x1b[30m./.env\x1b[0m if no longer used.'
  );
});

module.exports.revertFiles = ['package.json'];
