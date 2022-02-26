import { onAuthStateChanged } from 'firebase/auth'
import { httpsCallable } from 'firebase/functions'
import { Router } from 'vue-router'
import { useFirebaseAuthStore } from 'stores/FirebaseAuth'
import { userRoles } from 'models/firebase-auth'
import { getAuth, getFunctions } from 'services/firebase'
// Types
import type { User } from 'firebase/auth'
import type { UserClaims } from 'models/firebase-auth'

function waitForUserClaims () {
  const store = useFirebaseAuthStore()

  if (store.currentUserClaims) {
    return new Promise<void>(resolve => resolve())
  }

  return new Promise<void>(resolve => {
    setTimeout(() => {
      waitForUserClaims()
        .then(() => resolve())
        .catch(() => undefined)
    }, 100)
  })
}

export function ensureAuthInitialized () {
  const store = useFirebaseAuthStore()

  if (store.isAuthInitialized) {
    if (store.currentUser) {
      // For newly signed up users, wait for getIdTokenResult and getIdToken to resolve
      // and set claims to store. Otherwise, routes that require checking roles will always deny access.
      return waitForUserClaims()
    }

    return new Promise<void>(resolve => resolve())
  }

  // Create the observer only once on init
  return new Promise<void>((resolve, reject) => {
    // Use a promise to make sure that the router will eventually show the route after the auth is initialized.
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(
      auth,
      user => {
        if (user) {
          // For already signed in users from last session, wait for getIdTokenResult to resolve
          // and set claims to store. Otherwise, routes that require checking roles will always deny access.
          waitForUserClaims()
            .then(() => {
              store.isAuthInitialized = true
              resolve()
              unsubscribe()
            })
            .catch(() => undefined)
        } else {
          store.isAuthInitialized = true
          resolve()
          unsubscribe()
        }
      },
      error => {
        reject(error)
        unsubscribe()
      })
  })
}

export function isAuthenticated () {
  const store = useFirebaseAuthStore()

  return store.isAuthenticated
}

export function handleAuthStateChanged (user: User | null, router: Router) {
  const store = useFirebaseAuthStore()

  store.currentUser = user
  store.currentUserClaims = null

  if (user) {
    // Signed in
    user.getIdTokenResult()
      .then(idTokenResult => {
        if (idTokenResult.claims.admin === undefined) {
          // For newly signed up users, server will assign claims but they are not returned together with
          // the token immediately. Force refresh the toke to get new claims.
          user.getIdToken(true)
            .then(() => handleAuthStateChanged(user, router))
            .catch(error => {
              console.error(error)
              throw new Error('getIdToken failed.')
            })
        } else {
          const claims: UserClaims = {}

          for (const role of userRoles) {
            claims[role] = idTokenResult.claims[role]
          }

          store.currentUserClaims = claims
        }
      })
      .catch(error => {
        console.error(error)
        throw new Error('getIdTokenResult failed.')
      })
  } else {
    // Signed out
    if (router.currentRoute.value.meta.requiresAuth) {
      void router.push({ name: 'SignedOut' })
    }
  }
}

export function signOut () {
  const auth = getAuth()
  return auth.signOut()
}

export async function createRemoteSignInToken () {
  const functions = getFunctions()
  const createAuthToken = httpsCallable(functions, 'auth-createAuthToken')

  try {
    const result = await createAuthToken()
    return result.data as string
  } catch (error) {
    console.error(error)
    throw new Error('Calling to auth-createAuthToken failed.')
  }
}
