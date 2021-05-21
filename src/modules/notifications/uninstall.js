module.exports = function (api) {
  api.removePath('src/composables/use-notifications.ts')

  if (api.appDir.endsWith('\\dev')) {
    api.removePath('src/boot/notifications-dev.ts')
    api.removePath('src/pages/Notifications.vue')
  }
}
