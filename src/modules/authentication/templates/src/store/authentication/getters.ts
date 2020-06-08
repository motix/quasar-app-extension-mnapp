import { GetterTree } from 'vuex'
import { StoreInterface } from 'store/index'
import { AuthenticationStateInterface } from './state'

const getters: GetterTree<AuthenticationStateInterface, StoreInterface> = {
  isCurrentUserLoaded (state) {
    return state.currentUser !== null
  },

  isAxiosWaitingListEmpty (state) {
    return state.axiosWaitingList.length === 0
  }
}

export default getters
