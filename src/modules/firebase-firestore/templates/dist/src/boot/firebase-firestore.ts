import { boot } from 'quasar/wrappers';

import { Timestamp } from 'firebase/firestore';

import useConfig from 'composables/useConfig';

export default boot(() => {
  const config = useConfig();

  if (config.docsPageSize === undefined) config.docsPageSize = 25;
  if (config.releaseDocsTimeout === undefined) config.releaseDocsTimeout = 5000;

  if (config.dateDataConverter === undefined) {
    config.dateDataConverter = {
      fromDate<T>(date: Date) {
        return Timestamp.fromDate(date) as unknown as T;
      },

      toDate<T>(data: T) {
        return (data as unknown as Timestamp).toDate();
      },
    };
  }
});
