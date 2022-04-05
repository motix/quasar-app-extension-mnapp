const { defineUninstall } = require('..');

module.exports = defineUninstall(function (api) {
  api.removePath('src/boot/shared-components.ts');
  api.removePath('src/components/shared/expandable-card');
  api.removePath('src/components/shared/transition');
  api.removePath('src/components/shared/validation');
  api.removePath('src/components/shared/GravatarImage.vue');
  api.removePath('src/components/shared/PercentInput.vue');
  api.removePath('src/components/shared/ThousandInput.vue');
  api.removePath('src/components/shared/QPagePadding.vue');
  api.removePath('src/components/shared/TopTooltip.vue');
  api.removePath('src/types/shared-components');

  if (api.appDir.endsWith('\\dev')) {
    api.removePath('src/boot/shared-components-dev.ts');
    api.removePath('src/pages/SharedComponents.vue');
  }
});
