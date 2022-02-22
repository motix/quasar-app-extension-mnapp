import firebaseConfig from 'app/firebase.json'
import { Auth, getAuth, connectAuthEmulator } from 'firebase/auth'
import { Firestore, getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { Functions, getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import useConfig from 'composables/use-config'

let auth: Auth
function getAuthOrEmulator () {
  if (auth) {
    return auth
  }

  auth = getAuth()

  if (process.env.FIREBASE_ENV === 'DEV') {
    connectAuthEmulator(auth, `http://localhost:${firebaseConfig.emulators.auth.port}`, { disableWarnings: !!process.env.DEBUGGING })
  }

  return auth
}

let firestore: Firestore
function getFirestoreOrEmulator () {
  if (firestore) {
    return firestore
  }

  firestore = getFirestore()

  if (process.env.FIREBASE_ENV === 'DEV') {
    connectFirestoreEmulator(firestore, 'localhost', firebaseConfig.emulators.firestore.port)
  }

  return firestore
}

let functions: Functions
function getFunctionsOrEmulator () {
  if (functions) {
    return functions
  }

  functions = getFunctions()
  const config = useConfig()

  if (config.firebaseRegion) {
    functions.region = config.firebaseRegion
  }

  if (process.env.FIREBASE_ENV === 'DEV') {
    connectFunctionsEmulator(functions, 'localhost', firebaseConfig.emulators.functions.port)
  }

  return functions
}

export { getAuthOrEmulator as getAuth }
export { getFirestoreOrEmulator as getFirestore }
export { getFunctionsOrEmulator as getFunctions }
