const { defineInstall } = require('..');

module.exports = defineInstall(function (api) {
  api.extendPackageJson({
    dependencies: {
      slack: '^11.0.2',
      'slack-message-parser': '^3.0.2',
    },
  });
  delete require.cache[api.resolve.app('package.json')];

  api.render('./templates/dist');

  api.onExitLog(
    ' \x1b[32mslack         • \x1b[0mPlease add \x1b[47m\x1b[30m.env\x1b[0m with Slack config based on \x1b[47m\x1b[30m./slack-env-template.txt\x1b[0m.',
  );
});
