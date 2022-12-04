const { defineUninstall } = require('..');

module.exports = defineUninstall(function (api) {
  api.removePath('slack-env-template.txt');
  api.removePath('src/boot/slack.ts');
  api.removePath('src/models/slack');
  api.removePath('src/services/slack.ts');
  api.removePath('src/types/slack.d.ts');
  api.removePath('src/types/slack-api.d.ts');

  api.onExitLog(
    '\x1b[32mslack         • \x1b[0mPlease remove \x1b[47m\x1b[30m./.env\x1b[0m if no longer used.'
  );
});

module.exports.revertFiles = ['package.json'];
