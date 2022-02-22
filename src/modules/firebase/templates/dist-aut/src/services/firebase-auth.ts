import { onAuthStateChanged } from 'firebase/auth'
import { httpsCallable } from 'firebase/functions'
import { Router } from 'vue-router'
import { Store } from 'vuex'
import { userRoles } from 'models/firebase-auth'
import { getAuth, getFunctions } from 'services/firebase'
import { firebaseAuthMutations } from 'store/firebase-auth'
// Types
import type { User } from 'firebase/auth'
import type { UserClaims } from 'models/firebase-auth'
import type { StateInterface } from 'store/index'
import type { FirebaseAuthGetters } from 'store/firebase-auth'

function waitForUserClaims (store: Store<StateInterface>) {
  if (store.state['firebase-auth'].currentUserClaims) {
    return new Promise<void>(resolve => resolve())
  }

  return new Promise<void>(resolve => {
    setTimeout(() => {
      waitForUserClaims(store)
        .then(() => resolve())
        .catch(() => undefined)
    }, 100)
  })
}

export function ensureAuthInitialized (store: Store<StateInterface>) {
  if (store.state['firebase-auth'].isAuthInitialized) {
    if (store.state['firebase-auth'].currentUser) {
      // For newly signed up users, wait for getIdTokenResult and getIdToken to resolve
      // and set claims to store. Otherwise, routes that require checking roles will always deny access.
      return waitForUserClaims(store)
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
          waitForUserClaims(store)
            .then(() => {
              store.commit(`firebase-auth/${firebaseAuthMutations.SET_AUTH_INITIALIZED}`)
              resolve()
              unsubscribe()
            })
            .catch(() => undefined)
        } else {
          store.commit(`firebase-auth/${firebaseAuthMutations.SET_AUTH_INITIALIZED}`)
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

export function isAuthenticated (store: Store<StateInterface>) {
  return (store.getters as FirebaseAuthGetters)['firebase-auth/isAuthenticated']
}

export function handleAuthStateChanged (user: User | null, router: Router, store: Store<StateInterface>) {
  store.commit(`firebase-auth/${firebaseAuthMutations.SET_CURRENT_USER}`, user)
  store.commit(`firebase-auth/${firebaseAuthMutations.SET_CURRENT_USER_CLAIMS}`, null)

  if (user) {
    // Signed in
    user.getIdTokenResult()
      .then(idTokenResult => {
        if (idTokenResult.claims.admin === undefined) {
          // For newly signed up users, server will assign claims but they are not returned together with
          // the token immediately. Force refresh the toke to get new claims.
          user.getIdToken(true)
            .then(() => handleAuthStateChanged(user, router, store))
            .catch(error => {
              console.error(error)
              throw new Error('getIdToken failed.')
            })
        } else {
          const claims: UserClaims = {}

          for (const role of userRoles) {
            claims[role] = idTokenResult.claims[role]
          }

          store.commit(`firebase-auth/${firebaseAuthMutations.SET_CURRENT_USER_CLAIMS}`, claims)
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
