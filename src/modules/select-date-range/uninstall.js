const { defineUninstall } = require('..');

module.exports = defineUninstall(function (api) {
  api.removePath('src/composables/useSelectDateRange.ts');
  api.removePath('src/types/select-date-range.d.ts');
});
