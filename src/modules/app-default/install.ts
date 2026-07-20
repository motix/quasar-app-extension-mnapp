import fs from 'fs';

import { defineInstall } from '../index.js';

export default defineInstall(function (api) {
  api.renderTemplate('dist', {
    prompts: api.prompts,
  });

  modifyFiles();

  if (api.prompts.https) {
    api.renderTemplate('dist-https');

    api.onExitLog(
      ' \x1b[32mapp-default   • \x1b[0mPlease add \x1b[47m\x1b[30mmkcerts\x1b[0m files as instructed.',
    );
  }

  function modifyFiles() {
    // Add `@import './quasar.variables-custom.scss'` to `quasar.variables.scss`.

    let quasarVariablesScss = fs.readFileSync(
      api.resolve.src('css/quasar.variables.scss'),
      'utf-8',
    );

    if (!quasarVariablesScss.includes("@import './quasar.variables-custom.scss';")) {
      quasarVariablesScss = `${quasarVariablesScss}
@import './quasar.variables-custom.scss';
`;

      fs.writeFileSync(api.resolve.src('css/quasar.variables.scss'), quasarVariablesScss, 'utf-8');
    }

    // Change router scroll behavior

    let routerIndexJs = fs.readFileSync(api.resolve.src('router/index.ts'), 'utf-8');

    if (!routerIndexJs.includes("behavior: 'smooth'")) {
      routerIndexJs = routerIndexJs.replace(
        '{ left: 0, top: 0 }',
        "{ left: 0, top: 0, behavior: 'smooth' }",
      );

      fs.writeFileSync(api.resolve.src('router/index.ts'), routerIndexJs, 'utf-8');
    }
  }
});
