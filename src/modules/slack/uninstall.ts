import { reduceJsonFile } from '../../lib/json-helpers.js';
import { defineUninstall } from '../index.js';

export default defineUninstall(function (api) {
  api.onExitLog(
    ' \x1b[32mslack         • \x1b[0mPlease remove \x1b[47m\x1b[30m./.env\x1b[0m if no longer used.',
  );

  api.removeTemplateTree('dist', {
    knownPaths: ['src/models/slack', 'src/services/slack'],
  });

  reduceJsonFile(api, 'package.json', ['dependencies.slack', 'dependencies.slack-message-parser']);
});
