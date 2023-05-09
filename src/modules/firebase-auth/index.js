const { defineIndex } = require('..');

// Give the function a name to identify the module when replacing prompts from app config in extension wrapper
module.exports = defineIndex(function firebaseAuth(api) {
  api.extendQuasarConf((conf) => {
    conf.boot.push('firebase-auth');
  });
});
