import { GetterTree } from 'vuex'
import { StateInterface } from 'store/index'
import { AuthenticationStateInterface } from './state'

export interface AuthenticationGetters {
  'authentication/isCurrentUserLoaded': boolean;
  'authentication/isAxiosWaitingListEmpty': boolean;
}
// eslint-disable-next-line no-redeclare, no-unused-vars, @typescript-eslint/no-unused-vars
export const AuthenticationGetters = undefined // Hack to avoid export .. was not found in './getters'

const getters: GetterTree<AuthenticationStateInterface, StateInterface> = {
  isCurrentUserLoaded (state) {
    return state.currentUser !== null
  },

  isAxiosWaitingListEmpty (state) {
    return state.axiosWaitingList.length === 0
  }
}

export default getters
