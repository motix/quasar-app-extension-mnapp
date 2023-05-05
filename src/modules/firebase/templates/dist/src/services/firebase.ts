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
import {
  connectStorageEmulator,
  FirebaseStorage,
  getStorage,
} from 'firebase/storage';

import useConfig from 'composables/useConfig';

const host = window.location.hostname;

let auth: Auth;
function getAuthOrEmulator() {
  if (auth) {
    return auth;
  }

  auth = getAuth();

  if (process.env.FIREBASE_ENV === 'DEV') {
    connectAuthEmulator(
      auth,
      `http://${host}:${firebaseConfig.emulators.auth.port}`,
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
      host,
      firebaseConfig.emulators.firestore.port
    );
  }

  return firestore;
}

let storage: FirebaseStorage;
function getStorageOrEmulator() {
  if (storage) {
    return storage;
  }

  storage = getStorage();

  if (process.env.FIREBASE_ENV === 'DEV') {
    connectStorageEmulator(
      storage,
      host,
      firebaseConfig.emulators.storage.port
    );
  }

  return storage;
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
      host,
      firebaseConfig.emulators.functions.port
    );
  }

  return functions;
}

export { getAuthOrEmulator as getAuth };
export { getFirestoreOrEmulator as getFirestore };
export { getStorageOrEmulator as getStorage };
export { getFunctionsOrEmulator as getFunctions };
