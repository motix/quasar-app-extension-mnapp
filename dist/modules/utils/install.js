import { defineInstall } from '../index.js';
export default defineInstall(function (api) {
    api.renderTemplate();
    if (!api.hasModule('firebase')) {
        api.extendPackageJson({
            dependencies: {
                '@firebase/firestore': '^4.7.8',
            },
        });
    }
});
