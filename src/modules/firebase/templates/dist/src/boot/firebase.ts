import { boot } from 'quasar/wrappers';

import { initializeApp } from 'firebase/app';

export default boot(() => {
  const options = process.env.FIREBASE_CONFIG;
  initializeApp(options);
});
