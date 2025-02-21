import { defineInstall } from '../index.js';
export default defineInstall(function (api) {
    api.extendPackageJson({
        dependencies: {
            firebaseui: '^6.1.0',
        },
    });
    const userRolesConfig = api.prompts.userRoles;
    const roles = userRolesConfig.split(',');
    const userRoles = roles.length > 0 ? `', '${roles.join("', '")}` : '';
    api.renderTemplate('dist', { userRoles });
    api.onExitLog(" \x1b[32mfirebase-auth • \x1b[0mPlease add \x1b[33mname: 'MainLayout'\x1b[0m to \x1b[33mMainLayout.vue\x1b[0m record in \x1b[47m\x1b[30m./src/router/routes.ts\x1b[0m.");
});
