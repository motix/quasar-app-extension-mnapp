const fs = require('fs');
const { reduceJsonFileArray } = require('../../lib/json-helpers');
const { defineInstall } = require('..');

module.exports = defineInstall(function (api) {
  api.extendPackageJson({
    scripts: {
      clean: 'yarn format-imports src && yarn format && yarn lint --fix',
      'r-mnapp': 'yarn u-mnapp && yarn i-mnapp && yarn clean',
    },

    dependencies: {
      // Upgrade Starter Kit packages
      pinia: '^2.0.35',
      '@quasar/extras': '^1.16.3',
      quasar: '^2.12.0',
      vue: '^3.2.47',
      'vue-router': '^4.1.6',
    },

    devDependencies: {
      // Upgrade Starter Kit packages
      '@typescript-eslint/eslint-plugin': '^5.59.2',
      '@typescript-eslint/parser': '^5.59.2',
      eslint: '^8.39.0',
      'eslint-plugin-vue': '^9.11.0',
      'eslint-config-prettier': '^8.8.0',
      prettier: '^2.8.8',
      '@types/node': '^20.0.0',
      '@quasar/app-vite': '^1.3.0',
      autoprefixer: '^10.4.14',
      typescript: '^5.0.4',
      // Add new packages
      'format-imports': '^3.2.3',
    },
  });
  delete require.cache[api.resolve.app('package.json')];

  api.render('./templates/dist');

  modifyFiles();

  function modifyFiles() {
    // Modify `.vscode/extensions.json`.

    const extensionsJson = require(api.resolve.app('.vscode/extensions.json'));

    if (
      !extensionsJson.recommendations?.includes(
        'rohit-gohri.format-code-action'
      )
    ) {
      api.extendJsonFile('.vscode/extensions.json', {
        recommendations: ['rohit-gohri.format-code-action'],
      });
      delete require.cache[api.resolve.app('.vscode/extensions.json')];
    }

    if (!extensionsJson.recommendations?.includes('dozerg.tsimportsorter')) {
      api.extendJsonFile('.vscode/extensions.json', {
        recommendations: ['dozerg.tsimportsorter'],
      });
      delete require.cache[api.resolve.app('.vscode/extensions.json')];
    }

    // Modify `.vscode/settings.json`. Default setting would often lead to prettier being run after eslint and eslint errors still being present.

    reduceJsonFileArray(api, '.vscode/settings.json', [
      { path: 'editor.codeActionsOnSave', value: 'source.fixAll.eslint' },
    ]);

    api.extendJsonFile('.vscode/settings.json', {
      'editor.formatOnSave': false,
      'editor.codeActionsOnSave': [
        'source.organizeImports.sortImports',
        'source.formatDocument',
        'source.fixAll.eslint',
      ],
    });
    delete require.cache[api.resolve.app('.vscode/settings.json')];

    // Modify `.eslintrc.cjs`.

    let eslintrcCjs = fs.readFileSync(
      api.resolve.app('.eslintrc.cjs'),
      'utf-8'
    );

    eslintrcCjs = eslintrcCjs
      .replace(
        "    'plugin:vue/vue3-essential', // Priority A: Essential (Error Prevention)",
        "    // 'plugin:vue/vue3-essential', // Priority A: Essential (Error Prevention)"
      )
      .replace(
        "    // 'plugin:vue/vue3-recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)",
        "    'plugin:vue/vue3-recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)"
      );

    if (!eslintrcCjs.includes('vue/attributes-order')) {
      eslintrcCjs = eslintrcCjs.replace(
        "    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'",
        `    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    // alphabetical
    'vue/attributes-order': ['warn', { alphabetical: true }]`
      );
    }

    fs.writeFileSync(api.resolve.app('.eslintrc.cjs'), eslintrcCjs, {
      encoding: 'utf-8',
    });
  }
});
