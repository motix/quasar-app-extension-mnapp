import fs from 'fs';
import { defineInstall } from '../index.js';
import { packagesLatestVersion } from './packages-version.js';
export default defineInstall(async function (api) {
    const dependencies = [
        // Upgrade Starter Kit packages
        'pinia',
        '@quasar/extras',
        'quasar',
        'vue',
        'vue-router',
        // Additional packages
        'vue-component-type-helpers',
    ];
    const devDependencies = [
        // Upgrade Starter Kit packages
        '@eslint/js',
        'eslint',
        'eslint-plugin-vue',
        'globals',
        'vue-tsc',
        '@vue/eslint-config-typescript',
        'vite-plugin-checker',
        'vue-eslint-parser',
        '@vue/eslint-config-prettier',
        'prettier',
        '@types/node',
        '@quasar/app-vite',
        'autoprefixer',
        'typescript',
    ];
    api.extendPackageJson({
        dependencies: Object.fromEntries(dependencies.map((item) => [item, packagesLatestVersion[item]])),
        devDependencies: Object.fromEntries(devDependencies.map((item) => [item, packagesLatestVersion[item]])),
    });
    await modifyFiles();
    async function modifyFiles() {
        // Modify `.vscode/extensions.json`.
        if (!fs.existsSync(api.resolve.app('.vscode/extensions.json'))) {
            fs.mkdirSync(api.resolve.app('.vscode'), { recursive: true });
            fs.writeFileSync(api.resolve.app('.vscode/extensions.json'), '{}');
        }
        const extensionsJson = (await import(api.resolve.app('.vscode/extensions.json'), {
            with: { type: 'json' },
        })).default;
        if (!extensionsJson.recommendations?.includes('aaron-bond.better-comments')) {
            api.extendJsonFile('.vscode/extensions.json', {
                recommendations: ['aaron-bond.better-comments'],
            });
        }
    }
});
