import { userRoles } from 'models/firebase-auth'
// Types
import type { GetterTree } from 'vuex'
import type { UserRole } from 'models/firebase-auth'
import type { StateInterface } from 'store/index'
import type { FirebaseAuthStateInterface } from './state'

export interface FirebaseAuthGetters {
  'firebase-auth/isAuthenticated': boolean;
  'firebase-auth/currentUserRoles': UserRole[];
}
// eslint-disable-next-line no-redeclare, no-unused-vars, @typescript-eslint/no-unused-vars
export const FirebaseAuthGetters = undefined // Hack to avoid export .. was not found in './getters'

const getters: GetterTree<FirebaseAuthStateInterface, StateInterface> = {
  isAuthenticated: state => {
    const ret: FirebaseAuthGetters['firebase-auth/isAuthenticated'] =
      !!state.currentUser
    return ret
  },

  currentUserRoles: state => {
    const ret: FirebaseAuthGetters['firebase-auth/currentUserRoles'] =
      []

    if (state.currentUserClaims !== null) {
      for (const role of userRoles) {
        if (state.currentUserClaims[role] === true) {
          ret.push(role)
        }
      }
    }

    return ret
  }
}

export default getters
