import fs from 'fs';
import { defineInstall } from '../index.js';
export default defineInstall(function (api) {
    const vendorsConfig = api.prompts.vendors;
    const vendors = vendorsConfig.split(',');
    // Font Awesome Pro, vue-fontawesome
    if (vendors.includes('fap')) {
        api.extendPackageJson({
            dependencies: {
                '@fortawesome/fontawesome-pro': '^6.7.2',
                '@fortawesome/fontawesome-svg-core': '^6.7.2',
                '@fortawesome/free-brands-svg-icons': '^6.7.2',
                '@fortawesome/pro-duotone-svg-icons': '^6.7.2',
                '@fortawesome/pro-light-svg-icons': '^6.7.2',
                '@fortawesome/pro-regular-svg-icons': '^6.7.2',
                '@fortawesome/pro-solid-svg-icons': '^6.7.2',
                '@fortawesome/vue-fontawesome': '^3.0.8',
            },
        });
        api.renderTemplate('dist-fap');
        const npmrc = fs.readFileSync(api.resolve.app('.npmrc'), 'utf-8');
        if (!npmrc.includes('@fortawesome:registry')) {
            api.onExitLog(' \x1b[32mvendors       • \x1b[0mFont Awesome registry is absent from \x1b[33m./.npmrc\x1b[0m. Affter adding please also add \x1b[33m.npmrc\x1b[0m to \x1b[33m./.gitignore\x1b[0m.');
        }
    }
    // axios
    if (vendors.includes('axs')) {
        api.extendPackageJson({
            dependencies: {
                axios: '^1.7.9',
            },
        });
    }
    // Lodash
    if (vendors.includes('lds')) {
        api.extendPackageJson({
            dependencies: {
                'lodash-es': '^4.17.21',
            },
            devDependencies: {
                '@types/lodash-es': '^4.17.12',
            },
        });
    }
    // js-guid
    if (vendors.includes('jgd')) {
        api.extendPackageJson({
            dependencies: {
                'js-guid': '^1.0.2',
            },
        });
    }
    // AutoMapper TypeScript
    if (vendors.includes('atm')) {
        api.extendPackageJson({
            dependencies: {
                '@automapper/core': '^8.8.1',
                '@automapper/pojos': '^8.8.1',
            },
        });
    }
    // vee-validate
    if (vendors.includes('vld')) {
        api.extendPackageJson({
            dependencies: {
                'vee-validate': '^4.15.0',
                yup: '^1.6.1',
            },
        });
    }
    // markdown-it
    if (vendors.includes('mkd')) {
        api.extendPackageJson({
            dependencies: {
                'vue-markdown-render': '^2.2.1',
            },
            devDependencies: {
                '@types/markdown-it': '^14.1.2',
            },
        });
    }
});
