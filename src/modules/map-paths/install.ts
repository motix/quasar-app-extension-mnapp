import { defineInstall } from '../index.js';

export default defineInstall(async function (api) {
  const tsconfigJson = (
    await import(api.resolve.app('./.quasar/tsconfig.json'), { with: { type: 'json' } })
  ).default;

  // Replace `./..` with `.` in all paths copied from `.quasar`
  for (const path in tsconfigJson.compilerOptions.paths) {
    tsconfigJson.compilerOptions.paths[path][0] =
      tsconfigJson.compilerOptions.paths[path][0].substring(3);
  }

  api.extendJsonFile('tsconfig.json', {
    compilerOptions: {
      paths: {
        ...tsconfigJson.compilerOptions.paths,
        utils: ['./src/utils'],
        'utils/*': ['./src/utils/*'],
        models: ['./src/models'],
        'models/*': ['./src/models/*'],
        api: ['./src/api'],
        'api/*': ['./src/api/*'],
        services: ['./src/services'],
        'services/*': ['./src/services/*'],
        composables: ['./src/composables'],
        'composables/*': ['./src/composables/*'],
      },
    },
  });
});
