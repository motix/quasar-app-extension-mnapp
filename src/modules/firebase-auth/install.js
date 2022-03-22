const { defineInstall, getExtensionConfig } = require('..');

module.exports = defineInstall(function (api) {
  const config = getExtensionConfig();
  const prompts = config.prompts('firebase-auth');

  /**
   * @type string
   */
  const userRolesConfig = prompts.userRoles;
  const roles = userRolesConfig.split(',');
  const userRoles = roles.length > 0 ? `', '${roles.join("', '")}` : '';
  api.render('./templates/dist', { config, userRoles });

  api.onExitLog(
    "\x1b[32mfirebase-auth • \x1b[0mPlease add \x1b[33mname: 'MainLayout'\x1b[0m to \x1b[33mMainLayout.vue\x1b[0m record in \x1b[47m\x1b[30m./src/router/routes.ts\x1b[0m."
  );
});

module.exports.extendPackageJson = {
  dependencies: {
    firebaseui: '^6.0.1',
  },
};
