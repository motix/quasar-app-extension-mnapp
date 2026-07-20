import fs from 'fs';
import { defineUninstall } from '../index.js';
export default defineUninstall(function (api) {
    modifyFiles();
    api.removeTemplateTree('dist', {
        knownPaths: ['.vscode/launch.json'],
        removeIfEmpty: ['mkcerts'],
    });
    if (api.prompts.https) {
        api.onExitLog(' \x1b[32mapp-default   • \x1b[0mPlease remove \x1b[47m\x1b[30m./.mkcerts\x1b[0m if no longer needed.');
    }
    function modifyFiles() {
        // [Reverse] Change router scroll behavior
        let routerIndexJs = fs.readFileSync(api.resolve.src('router/index.ts'), 'utf-8');
        if (routerIndexJs.includes("behavior: 'smooth'")) {
            routerIndexJs = routerIndexJs.replace("{ left: 0, top: 0, behavior: 'smooth' }", '{ left: 0, top: 0 }');
            fs.writeFileSync(api.resolve.src('router/index.ts'), routerIndexJs, 'utf-8');
        }
        // [Reverse] Add `@import './quasar.variables-custom.scss'` to `quasar.variables.scss`.
        let quasarVariablesScss = fs.readFileSync(api.resolve.src('css/quasar.variables.scss'), 'utf-8');
        if (quasarVariablesScss.includes("@import './quasar.variables-custom.scss';")) {
            quasarVariablesScss = quasarVariablesScss.replace(`
@import './quasar.variables-custom.scss';
`, '');
            fs.writeFileSync(api.resolve.src('css/quasar.variables.scss'), quasarVariablesScss, 'utf-8');
        }
    }
});
