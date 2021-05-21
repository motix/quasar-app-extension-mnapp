module.exports = function (api) {
  api.removePath('src/models/authentication.ts')
  api.removePath('src/api/authentication.ts')
  api.removePath('src/store/authentication')
  api.removePath('src/boot/authentication.ts')
  api.removePath('src/components/authentication/LoginExpiredDialog.vue')
  api.removePath('src/composables/use-authentication.ts')
  api.removePath('src/composables/use-safe-axios.ts')
  api.removePath('src/pages/LoadUser.vue')
  api.removePath('src/pages/NotAuthenticated.vue')
}
