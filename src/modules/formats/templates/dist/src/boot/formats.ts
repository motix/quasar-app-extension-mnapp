import { boot } from 'quasar/wrappers';

import useConfig from 'composables/useConfig';

export default boot(() => {
  const config = useConfig();

  if (config.dateFormat === undefined) config.dateFormat = 'DD/MM/YYYY';
  if (config.editDateFormat === undefined) config.editDateFormat = 'DDMMYYYY';
  if (config.dateMask === undefined) config.dateMask = '##/##/####';
});
