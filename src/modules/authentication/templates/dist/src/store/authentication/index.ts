import { Module } from 'vuex'
import { StateInterface } from 'store/index'
import state, { AuthenticationStateInterface } from './state'
import actions from './actions'
import getters, { AuthenticationGetters } from './getters'
import mutations, * as authenticationMutations from './mutations'

const module: Module<AuthenticationStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default module
export { AuthenticationGetters, authenticationMutations }
