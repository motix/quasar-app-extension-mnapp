import firebaseConfig from 'app/firebase.json';

import { Auth, connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  connectFirestoreEmulator,
  Firestore,
  getFirestore,
} from 'firebase/firestore';
import {
  connectFunctionsEmulator,
  Functions,
  getFunctions,
} from 'firebase/functions';

import useConfig from 'composables/useConfig';

let auth: Auth;
function getAuthOrEmulator() {
  if (auth) {
    return auth;
  }

  auth = getAuth();

  if (process.env.FIREBASE_ENV === 'DEV') {
    connectAuthEmulator(
      auth,
      `http://localhost:${firebaseConfig.emulators.auth.port}`,
      { disableWarnings: !!process.env.DEBUGGING }
    );
  }

  return auth;
}

let firestore: Firestore;
function getFirestoreOrEmulator() {
  if (firestore) {
    return firestore;
  }

  firestore = getFirestore();

  if (process.env.FIREBASE_ENV === 'DEV') {
    connectFirestoreEmulator(
      firestore,
      'localhost',
      firebaseConfig.emulators.firestore.port
    );
  }

  return firestore;
}

let functions: Functions;
function getFunctionsOrEmulator() {
  if (functions) {
    return functions;
  }

  functions = getFunctions();
  const { firebaseRegion } = useConfig();

  if (firebaseRegion) {
    functions.region = firebaseRegion;
  }

  if (process.env.FIREBASE_ENV === 'DEV') {
    connectFunctionsEmulator(
      functions,
      'localhost',
      firebaseConfig.emulators.functions.port
    );
  }

  return functions;
}

export { getAuthOrEmulator as getAuth };
export { getFirestoreOrEmulator as getFirestore };
export { getFunctionsOrEmulator as getFunctions };
