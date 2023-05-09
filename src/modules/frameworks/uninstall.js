const fs = require('fs');
const {
  reduceJsonFileArray,
  reduceJsonFile,
} = require('../../lib/json-helpers');
const { defineUninstall } = require('..');

module.exports = defineUninstall(function (api) {
  modifyFiles();

  api.removePath('import-sorter.json');

  reduceJsonFile(api, 'package.json', [
    'scripts.clean',
    'devDependencies.format-imports',
  ]);
  api.extendJsonFile('package.json', {
    scripts: {
      'r-mnapp': 'yarn u-mnapp && yarn i-mnapp',
    },

    dependencies: {
      // Restore Starter Kit packages
      pinia: '^2.0.11',
      '@quasar/extras': '^1.0.0',
      quasar: '^2.6.0',
      vue: '^3.0.0',
      'vue-router': '^4.0.0',
    },

    devDependencies: {
      // Restore Starter Kit packages
      '@typescript-eslint/eslint-plugin': '^5.10.0',
      '@typescript-eslint/parser': '^5.10.0',
      eslint: '^8.10.0',
      'eslint-plugin-vue': '^9.0.0',
      'eslint-config-prettier': '^8.1.0',
      prettier: '^2.5.1',
      '@types/node': '^12.20.21',
      '@quasar/app-vite': '^1.0.0',
      autoprefixer: '^10.4.2',
      typescript: '^4.5.4',
    },
  });
  delete require.cache[api.resolve.app('package.json')];

  function modifyFiles() {
    // [Reverse] Modify `.eslintrc.cjs`.

    let eslintrcCjs = fs.readFileSync(
      api.resolve.app('.eslintrc.cjs'),
      'utf-8'
    );

    eslintrcCjs = eslintrcCjs
      .replace(
        "    // 'plugin:vue/vue3-essential', // Priority A: Essential (Error Prevention)",
        "    'plugin:vue/vue3-essential', // Priority A: Essential (Error Prevention)"
      )
      .replace(
        "    'plugin:vue/vue3-recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)",
        "    // 'plugin:vue/vue3-recommended', // Priority C: Recommended (Minimizing Arbitrary Choices and Cognitive Overhead)"
      );

    if (eslintrcCjs.includes('vue/attributes-order')) {
      eslintrcCjs = eslintrcCjs.replace(
        `,

    // alphabetical
    'vue/attributes-order': ['warn', { alphabetical: true }]`,
        ''
      );
    }

    fs.writeFileSync(api.resolve.app('.eslintrc.cjs'), eslintrcCjs, {
      encoding: 'utf-8',
    });

    // [Reverse] Modify `.vscode/settings.json`. Default setting would often lead to prettier being run after eslint and eslint errors still being present.

    reduceJsonFileArray(api, '.vscode/settings.json', [
      {
        path: 'editor.codeActionsOnSave',
        value: 'source.organizeImports.sortImports',
      },
      { path: 'editor.codeActionsOnSave', value: 'source.formatDocument' },
    ]);

    api.extendJsonFile('.vscode/settings.json', {
      'editor.formatOnSave': true,
    });
    delete require.cache[api.resolve.app('.vscode/settings.json')];

    // [Reverse] Modify `.vscode/extensions.json`.

    reduceJsonFileArray(api, '.vscode/extensions.json', [
      { path: 'recommendations', value: 'rohit-gohri.format-code-action' },
      { path: 'recommendations', value: 'dozerg.tsimportsorter' },
    ]);
  }
});
