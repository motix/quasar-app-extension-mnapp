import { GetterTree } from 'vuex'
import { userRoles, UserRole } from 'models/firebase-auth'
import { StateInterface } from 'store/index'
import { FirebaseAuthStateInterface } from './state'

export interface FirebaseAuthGetters {
  'firebase-auth/isAuthenticated': boolean;
  'firebase-auth/currentUserRoles': UserRole[];
}
// eslint-disable-next-line no-redeclare, no-unused-vars, @typescript-eslint/no-unused-vars
export const FirebaseAuthGetters = undefined // Hack to avoid export .. was not found in './getters'

const getters: GetterTree<FirebaseAuthStateInterface, StateInterface> = {
  isAuthenticated (state) {
    return !!state.currentUser
  },

  currentUserRoles (state) {
    const roles: string[] = []

    if (state.currentUserClaims !== null) {
      for (const role of userRoles) {
        if (state.currentUserClaims[role] === true) {
          roles.push(role)
        }
      }
    }

    return roles
  }
}

export default getters
