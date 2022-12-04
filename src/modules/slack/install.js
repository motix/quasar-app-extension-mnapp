const { defineInstall, getExtensionConfig } = require('..');

module.exports = defineInstall(function (api) {
  const config = getExtensionConfig();
  const prompts = config.prompts('slack');

  api.render('./templates/dist', {
    prompts,
  });

  api.onExitLog(
    '\x1b[32mslack         • \x1b[0mPlease add \x1b[47m\x1b[30m.env\x1b[0m with Slack config based on \x1b[47m\x1b[30m./slack-env-template.txt\x1b[0m.'
  );
});

module.exports.extendPackageJson = {
  dependencies: {
    slack: '^11.0.2',
  },
};
