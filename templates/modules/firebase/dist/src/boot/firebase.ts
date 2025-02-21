import type { FirebaseOptions } from 'firebase/app';

import { defineBoot } from '#q-app/wrappers';

import { initializeApp } from 'firebase/app';

export default defineBoot(() => {
  const options: FirebaseOptions = !process.env.FIREBASE_CONFIG
    ? {}
    : JSON.parse(process.env.FIREBASE_CONFIG);
  initializeApp(options);
});
