import { reduceJsonFile } from '../../lib/json-helpers.js';
import { defineUninstall } from '../index.js';
export default defineUninstall(function (api) {
    reduceJsonFile(api, 'tsconfig.json', ['compilerOptions.paths'], ['compilerOptions']);
    // The template is actually empty. Use this to remove empty paths only.
    api.removeTemplateTree('dist', {
        removeIfEmpty: [
            'src/utils',
            'src/models',
            'src/api',
            'src/services',
            'src/composables',
            'src/types',
        ],
    });
});
