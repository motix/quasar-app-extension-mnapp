module.exports = function (api) {
  api.removePath('src/return-url.d.ts')
  api.removePath('src/boot/return-url.ts')
  api.removePath('src/composables/useReturnUrl.ts')
}
