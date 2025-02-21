import { reduceJsonFile } from '../../lib/json-helpers.js';
import { defineUninstall } from '../index.js';

export default defineUninstall(function (api) {
  // Font Awesome Pro, vue-fontawesome
  api.removeTemplateTree('dist-fap');

  api.onExitLog(
    ' \x1b[32mvendors       • \x1b[0mPlease remove \x1b[47m\x1b[30m./.npmrc\x1b[0m if no longer used.',
  );

  reduceJsonFile(api, 'package.json', [
    // Font Awesome Pro, vue-fontawesome
    'dependencies.@fortawesome/fontawesome-pro',
    'dependencies.@fortawesome/fontawesome-svg-core',
    'dependencies.@fortawesome/free-brands-svg-icons',
    'dependencies.@fortawesome/pro-duotone-svg-icons',
    'dependencies.@fortawesome/pro-light-svg-icons',
    'dependencies.@fortawesome/pro-regular-svg-icons',
    'dependencies.@fortawesome/pro-solid-svg-icons',
    'dependencies.@fortawesome/vue-fontawesome',

    // axios
    'dependencies.axios',

    // Lodash
    'dependencies.lodash-es',
    'devDependencies.@types/lodash-es',

    // js-guid
    'dependencies.js-guid',

    // AutoMapper TypeScript
    'dependencies.@automapper/core',
    'dependencies.@automapper/pojos',

    // vee-validate
    'dependencies.vee-validate',
    'dependencies.yup',

    // markdown-it
    'dependencies.vue-markdown-render',
    'devDependencies.@types/markdown-it',
  ]);
});
