import { Module } from 'vuex'
import { StoreInterface } from 'store/index'
import state, { AuthenticationStateInterface } from './state'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const module: Module<AuthenticationStateInterface, StoreInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default module
