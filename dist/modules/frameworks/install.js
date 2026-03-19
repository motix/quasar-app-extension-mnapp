import { defineInstall } from '../index.js';
export default defineInstall(async function (api) {
    api.extendPackageJson({
        dependencies: {
            // Upgrade Starter Kit packages
            pinia: '^3.0.4',
            '@quasar/extras': '^1.17.0',
            quasar: '^2.18.7',
            vue: '^3.5.30',
            'vue-router': '^5.0.4',
            // Additional packages
            'vue-component-type-helpers': '^3.2.6',
        },
        devDependencies: {
            // Upgrade Starter Kit packages
            // TODO: Upgrade `@eslint/js`, `eslint`, `eslint-plugin-vue`
            '@eslint/js': '^9.20.0',
            eslint: '^9.20.1',
            'eslint-plugin-vue': '^9.32.0',
            globals: '^17.4.0',
            'vue-tsc': '^3.2.6',
            '@vue/eslint-config-typescript': '^14.7.0',
            'vite-plugin-checker': '^0.12.0',
            'vue-eslint-parser': '^10.4.0',
            '@vue/eslint-config-prettier': '^10.2.0',
            prettier: '^3.8.1',
            '@types/node': '^25.5.0',
            '@quasar/app-vite': '^2.5.1',
            autoprefixer: '^10.4.27',
            typescript: '^5.9.3',
        },
    });
    await modifyFiles();
    async function modifyFiles() {
        // Modify `.vscode/extensions.json`.
        const extensionsJson = (await import(api.resolve.app('.vscode/extensions.json'), {
            with: { type: 'json' },
        })).default;
        if (!extensionsJson.recommendations?.includes('aaron-bond.better-comments')) {
            api.extendJsonFile('.vscode/extensions.json', {
                recommendations: ['aaron-bond.better-comments'],
            });
        }
        // Modify tsconfig.json
        const tsconfigJson = (await import(api.resolve.app('tsconfig.json'), {
            with: { type: 'json' },
        })).default;
        if (!tsconfigJson.exclude?.includes('.bk')) {
            api.extendJsonFile('tsconfig.json', {
                exclude: ['.bk'],
            });
        }
    }
});
