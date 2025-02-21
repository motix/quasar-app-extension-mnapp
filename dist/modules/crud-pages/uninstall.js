import { defineUninstall } from '../index.js';
export default defineUninstall(function (api) {
    api.removeTemplateTree('dist', {
        knownPaths: ['src/components/shared/crud-pages', 'src/composables/crud-pages'],
    });
});
