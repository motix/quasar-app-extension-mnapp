const fs = require('fs');
const { defineUninstall } = require('..');

// Give the function a name to identify the module when replacing prompts from app config in extension wrapper
module.exports = defineUninstall(function appDefault(api) {
  modifyFiles();

  api.removePath('.vscode/launch.json');
  api.removePath('mkcerts/Instructions.md');
  api.removePath('src/boot/notify.ts');
  api.removePath('src/css/app-default.scss');
  api.removePath('src/css/quasar.variables-custom.scss');
  api.removePath('src/layouts/AliveSubLayout.vue');
  api.removePath('src/types/app-default.d.ts');

  if (api.prompts.https) {
    api.onExitLog(
      '\x1b[32mapp-default   • \x1b[0mPlease remove \x1b[47m\x1b[30m./.mkcerts\x1b[0m if no longer used.'
    );
  }

  function modifyFiles() {
    // [Reverse] Add `@import './quasar.variables-custom.scss'` to `quasar.variables.scss`.

    let quasarVariablesScss = fs.readFileSync(
      api.resolve.src('css/quasar.variables.scss'),
      'utf-8'
    );

    if (
      quasarVariablesScss.includes("@import './quasar.variables-custom.scss';")
    ) {
      quasarVariablesScss = quasarVariablesScss.replace(
        `
@import './quasar.variables-custom.scss';
`,
        ''
      );

      fs.writeFileSync(
        api.resolve.src('css/quasar.variables.scss'),
        quasarVariablesScss,
        {
          encoding: 'utf-8',
        }
      );
    }
  }
});
