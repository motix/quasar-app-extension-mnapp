import { defineInstall } from '../index.js';
export default defineInstall(async function (api) {
    api.extendPackageJson({
        dependencies: {
            // Upgrade Starter Kit packages
            pinia: '^3.0.1',
            '@quasar/extras': '^1.16.17',
            quasar: '^2.17.7',
            vue: '^3.5.13',
            'vue-router': '^4.5.0',
        },
        devDependencies: {
            // Upgrade Starter Kit packages
            '@eslint/js': '^9.20.0',
            eslint: '^9.20.1',
            'eslint-plugin-vue': '^9.32.0',
            globals: '^15.15.0',
            'vue-tsc': '^2.2.2',
            '@vue/eslint-config-typescript': '^14.4.0',
            'vite-plugin-checker': '^0.8.0',
            '@vue/eslint-config-prettier': '^10.2.0',
            prettier: '^3.5.1',
            '@types/node': '^22.13.4',
            '@quasar/app-vite': '^2.1.0',
            autoprefixer: '^10.4.20',
            typescript: '^5.7.3',
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
