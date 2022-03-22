const { defineUninstall } = require('..');

module.exports = defineUninstall(function (api) {
  api.removePath('src/composables/useNotifications.ts');

  if (api.appDir.endsWith('\\dev')) {
    api.removePath('src/boot/notifications-dev.ts');
    api.removePath('src/pages/Notifications.vue');
  }
});
