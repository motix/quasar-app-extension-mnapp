import state from './state'
import actions from './actions'
import getters from './getters'
import mutations, * as firebaseAuthMutations from './mutations'
// Types
import type { Module } from 'vuex'
import type { StateInterface } from 'store/index'
import type { FirebaseAuthStateInterface } from './state'
import type { FirebaseAuthGetters } from './getters'

const module: Module<FirebaseAuthStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default module
export { FirebaseAuthGetters, firebaseAuthMutations }
