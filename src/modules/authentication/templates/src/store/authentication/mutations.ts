import { MutationTree } from 'vuex'
import { AuthenticationStateInterface, Member, AxiosWaitingListItem } from './state'

const mutation: MutationTree<AuthenticationStateInterface> = {
  storeCurrentUser (state: AuthenticationStateInterface, user: Member) {
    state.currentUser = user
  },

  addAxiosCall (state: AuthenticationStateInterface, item: AxiosWaitingListItem) {
    state.axiosWaitingList.push(item)
  },

  executeAndClearAxiosWaitingList (state: AuthenticationStateInterface,
    callback: (callMethod: Function, resolve: Function, reject: Function) => void) {
    const currentList = state.axiosWaitingList
    state.axiosWaitingList = []

    for (const item of currentList) {
      callback(item.callMethod, item.resolve, item.reject)
    }
  }
}

export default mutation

const STORE_CURRENT_USER = 'storeCurrentUser'
const ADD_AXIOS_CALL = 'addAxiosCall'
const EXECUTE_AND_CLEAR_AXIOS_WAITING_LIST = 'executeAndClearAxiosWaitingList'

export {
  STORE_CURRENT_USER,
  ADD_AXIOS_CALL,
  EXECUTE_AND_CLEAR_AXIOS_WAITING_LIST
}
