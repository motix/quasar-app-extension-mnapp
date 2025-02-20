import type { FirebaseOptions } from 'firebase/app';

import { boot } from 'quasar/wrappers';

import { initializeApp } from 'firebase/app';

export default boot(() => {
  const options: FirebaseOptions = !process.env.FIREBASE_CONFIG
    ? {}
    : JSON.parse(process.env.FIREBASE_CONFIG);
  initializeApp(options);
});
