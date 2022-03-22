const { defineUninstall } = require('..');

module.exports = defineUninstall(function (api) {
  api.removePath('src/boot/scroll.ts');
  api.removePath('src/composables/useScroll.ts');
  api.removePath('src/types/scroll.d.ts');

  if (api.appDir.endsWith('\\dev')) {
    api.removePath('src/boot/scroll-dev.ts');
    api.removePath('src/pages/Scroll.vue');
  }
});
