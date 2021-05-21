import { ActionTree } from 'vuex'
import authenticationApi from 'api/authentication'
import { StateInterface } from 'store/index'
import { AuthenticationStateInterface } from './state'
import { authenticationMutations } from './index'

const actions: ActionTree<AuthenticationStateInterface, StateInterface> = {
  async loadUser ({ commit }) {
    const resp = await authenticationApi.currentUser()
    switch (resp.data.status) {
      case 'Authenticated':
        commit(authenticationMutations.SET_CURRENT_USER, resp.data.currentUser)
        return resp
      case 'Unauthenticated':
        throw resp
      case 'UserNotFound':
        console.error('User not found or inactive.')
        throw resp
      default:
        console.error('Load user satus not recognized.')
        throw resp
    }
  }
}

export default actions
