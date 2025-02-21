import { defineInstall } from '../index.js';
export default defineInstall(function (api) {
    api.extendPackageJson({
        dependencies: {
            apexcharts: '^4.4.0',
            'vue3-apexcharts': '^1.8.0',
        },
    });
    api.renderTemplate();
});
