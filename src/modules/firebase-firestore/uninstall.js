/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineUninstall } = require('..')

module.exports = defineUninstall(function (api) {
  api.removePath('src/firebase-firestore.d.ts')
  api.removePath('src/boot/firebase-firestore.ts')
  api.removePath('src/services/firebase-firestore')
})
