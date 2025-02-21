import { defineInstall } from '../index.js';
export default defineInstall(function (api) {
    api.extendPackageJson({
        dependencies: {
            exceljs: '^4.4.0',
            'file-saver': '^2.0.5',
        },
        devDependencies: {
            '@types/file-saver': '^2.0.7',
        },
    });
    api.renderTemplate();
});
