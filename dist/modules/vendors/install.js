import fs from 'fs';
import { defineInstall } from '../index.js';
import packagesVersion from './packages-version.js';
export default defineInstall(function (api) {
    const vendorsConfig = api.prompts.vendors;
    const vendors = vendorsConfig.split(',');
    let packages;
    // Font Awesome Pro, vue-fontawesome
    if (vendors.includes('fap')) {
        packages = [
            '@fortawesome/fontawesome-pro',
            '@fortawesome/fontawesome-svg-core',
            '@fortawesome/free-brands-svg-icons',
            '@fortawesome/pro-solid-svg-icons',
            '@fortawesome/pro-regular-svg-icons',
            '@fortawesome/pro-light-svg-icons',
            '@fortawesome/pro-thin-svg-icons',
            '@fortawesome/pro-duotone-svg-icons',
            '@fortawesome/vue-fontawesome',
        ];
        api.extendPackageJson({
            dependencies: Object.fromEntries(packages.map((item) => [item, packagesVersion[item]])),
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
                axios: packagesVersion.axios,
            },
        });
    }
    // Lodash
    if (vendors.includes('lds')) {
        api.extendPackageJson({
            dependencies: {
                'lodash-es': packagesVersion['lodash-es'],
            },
            devDependencies: {
                '@types/lodash-es': packagesVersion['@types/lodash-es'],
            },
        });
    }
    // js-guid
    if (vendors.includes('jgd')) {
        api.extendPackageJson({
            dependencies: {
                'js-guid': packagesVersion['js-guid'],
            },
        });
    }
    // AutoMapper TypeScript
    if (vendors.includes('atm')) {
        packages = ['@automapper/core', '@automapper/pojos'];
        api.extendPackageJson({
            dependencies: Object.fromEntries(packages.map((item) => [item, packagesVersion[item]])),
        });
    }
    // vee-validate
    if (vendors.includes('vld')) {
        packages = ['vee-validate', '@vee-validate/yup', 'yup'];
        api.extendPackageJson({
            dependencies: Object.fromEntries(packages.map((item) => [item, packagesVersion[item]])),
        });
    }
    // markdown-it
    if (vendors.includes('mkd')) {
        api.extendPackageJson({
            dependencies: {
                'vue-markdown-render': packagesVersion['vue-markdown-render'],
            },
            devDependencies: {
                '@types/markdown-it': packagesVersion['@types/markdown-it'],
            },
        });
    }
});
