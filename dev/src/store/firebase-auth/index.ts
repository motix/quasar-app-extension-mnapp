import { Module } from 'vuex'
import { StateInterface } from 'store/index'
import state, { FirebaseAuthStateInterface } from './state'
import actions from './actions'
import getters, { FirebaseAuthGetters } from './getters'
import mutations, * as firebaseAuthMutations from './mutations'

const module: Module<FirebaseAuthStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default module
export { FirebaseAuthGetters, firebaseAuthMutations }
