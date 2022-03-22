const { defineInstall, getExtensionConfig } = require('..');

module.exports = defineInstall(function (api) {
  const config = getExtensionConfig();
  const prompts = config.prompts('app-default');

  api.render('./templates/dist', {
    prompts,
  });

  api.onExitLog(
    "\x1b[32mapp-default   • \x1b[0mPlease add \x1b[33m@import './quasar.variables-custom.scss'\x1b[0m to \x1b[47m\x1b[30m./src/css/quasar.variables.scss\x1b[0m."
  );

  if (prompts.https) {
    api.render('./templates/dist-https');

    api.onExitLog(
      '\x1b[32mapp-default   • \x1b[0mPlease add \x1b[47m\x1b[30mmkcerts\x1b[0m files as instructed.'
    );
  }
});
