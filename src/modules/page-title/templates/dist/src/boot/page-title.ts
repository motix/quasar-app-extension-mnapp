import packageJson from 'app/package.json';

import { boot } from 'quasar/wrappers';

import useConfig from 'composables/useConfig';

export default boot(() => {
  const config = useConfig();

  if (config.appName === undefined) config.appName = packageJson.productName;
});
