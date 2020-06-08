import { ActionTree } from 'vuex'
import { StoreInterface } from 'store/index'
import { AuthenticationStateInterface } from './state'
import { STORE_CURRENT_USER } from './mutations'
import authenticationApi from '../../api/authentication'

const actions: ActionTree<AuthenticationStateInterface, StoreInterface> = {
  loadUser ({ commit }) {
    return new Promise((resolve, reject) => {
      authenticationApi.currentUser()
        .then(resp => {
          switch (resp.data.status) {
            case 'Authenticated':
              commit(STORE_CURRENT_USER, resp.data.currentUser)
              resolve(resp)
              break
            case 'Unauthenticated':
              reject(resp)
              break
            case 'UserNotFound':
              reject(resp)
              throw new Error('User not found or inactive.')
            default:
              reject(resp)
              throw new Error('Load user satus not recognized.')
          }
        })
        .catch(err => {
          console.error(err)
          reject(err)
        })
    })
  }
}

export default actions
