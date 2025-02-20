const fs = require('fs');
const { defineInstall } = require('..');

// Give the function a name to identify the module when replacing prompts from app config in extension wrapper
module.exports = defineInstall(function appDefault(api) {
  api.render('./templates/dist', {
    prompts: api.prompts,
  });

  modifyFiles();

  if (api.prompts.https) {
    api.render('./templates/dist-https');

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

      fs.writeFileSync(api.resolve.src('css/quasar.variables.scss'), quasarVariablesScss, {
        encoding: 'utf-8',
      });
    }
  }
});
