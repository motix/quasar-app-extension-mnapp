import { User } from 'firebase/auth'
import { UserClaims } from 'models/firebase-auth'
import { MutationTree } from 'vuex'
import { FirebaseAuthStateInterface } from './state'

export const SET_AUTH_INITIALIZED = 'setAuthInitialized'
export const SET_CURRENT_USER = 'setCurrentUser'
export const SET_CURRENT_USER_CLAIMS = 'setCurrentUserClaims'

const mutation: MutationTree<FirebaseAuthStateInterface> = {
  [SET_AUTH_INITIALIZED] (state: FirebaseAuthStateInterface) {
    state.isAuthInitialized = true
  },

  [SET_CURRENT_USER] (state: FirebaseAuthStateInterface, user: User | null) {
    state.currentUser = user
  },

  [SET_CURRENT_USER_CLAIMS] (state: FirebaseAuthStateInterface, claims: UserClaims | null) {
    state.currentUserClaims = claims
  }
}

export default mutation
