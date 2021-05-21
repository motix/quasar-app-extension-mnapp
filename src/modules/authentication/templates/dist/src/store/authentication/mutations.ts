import { MutationTree } from 'vuex'
import { User, AxiosWaitingListItem } from 'models/authentication'
import { AuthenticationStateInterface } from './state'

const mutation: MutationTree<AuthenticationStateInterface> = {
  setCurrentUser (state: AuthenticationStateInterface, user: User) {
    state.currentUser = user
  },

  addAxiosCall (state: AuthenticationStateInterface, item: AxiosWaitingListItem) {
    state.axiosWaitingList.push(item)
  },

  executeAndClearAxiosWaitingList (state: AuthenticationStateInterface, callback: (item: AxiosWaitingListItem) => void) {
    const currentList = state.axiosWaitingList
    state.axiosWaitingList = []

    for (const item of currentList) {
      callback(item)
    }
  }
}

export default mutation

export const SET_CURRENT_USER = 'setCurrentUser'
export const ADD_AXIOS_CALL = 'addAxiosCall'
export const EXECUTE_AND_CLEAR_AXIOS_WAITING_LIST = 'executeAndClearAxiosWaitingList'
