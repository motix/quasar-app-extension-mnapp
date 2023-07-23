const fs = require('fs');
const { reduceJsonFileArray } = require('../../lib/json-helpers');
const { defineInstall } = require('..');

module.exports = defineInstall(function (api) {
  api.extendPackageJson({
    scripts: {
      clean: 'yarn format-imports src && yarn format && yarn lint --fix',
      tsc: 'yarn vue-tsc --noEmit --skipLibCheck',
      'r-mnapp': 'yarn u-mnapp && yarn i-mnapp && yarn clean',
    },

    dependencies: {
      // Upgrade Starter Kit packages
      pinia: '^2.1.4',
      '@quasar/extras': '^1.16.5',
      quasar: '^2.12.3',
      vue: '^3.3.4',
      'vue-router': '^4.2.4',
    },

    devDependencies: {
      // Upgrade Starter Kit packages
      '@typescript-eslint/eslint-plugin': '^6.1.0',
      '@typescript-eslint/parser': '^6.1.0',
      eslint: '^8.45.0',
      'eslint-plugin-vue': '^9.15.1',
      'eslint-config-prettier': '^8.8.0',
      prettier: '^2.8.8',
      '@types/node': '^20.4.4',
      '@quasar/app-vite': '^1.4.3',
      autoprefixer: '^10.4.14',
      typescript: '^5.1.6',
      // Add new packages
      'format-imports': '^3.2.5',
      'vue-tsc': '^1.8.6',
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

    if (
      !extensionsJson.recommendations?.includes('aaron-bond.better-comments')
    ) {
      api.extendJsonFile('.vscode/extensions.json', {
        recommendations: ['aaron-bond.better-comments'],
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

    // Modify tsconfig.json

    const tsconfigJson = require(api.resolve.app('tsconfig.json'));

    if (!tsconfigJson.exclude?.includes('.bk')) {
      api.extendJsonFile('tsconfig.json', {
        exclude: ['.bk'],
      });
      delete require.cache[api.resolve.app('tsconfig.json')];
    }

    // Modify src/shims-vue.d.ts

    let shimsVueDTs = fs.readFileSync(
      api.resolve.app('src/shims-vue.d.ts'),
      'utf-8'
    );

    shimsVueDTs = shimsVueDTs.replace(
      `declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}`,
      `// declare module '*.vue' {
//   import type { DefineComponent } from 'vue';
//   const component: DefineComponent<{}, {}, any>;
//   export default component;
// }`
    );

    fs.writeFileSync(api.resolve.app('src/shims-vue.d.ts'), shimsVueDTs, {
      encoding: 'utf-8',
    });
  }
});
