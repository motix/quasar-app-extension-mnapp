import { User, AxiosWaitingListItem } from 'models/authentication'

function state () {
  return {
    currentUser: null as User | null,
    axiosWaitingList: [] as AxiosWaitingListItem[]
  }
}

export type AuthenticationStateInterface = ReturnType<typeof state>

declare module 'store/index' {
  interface StateInterface {
    authentication: AuthenticationStateInterface;
  }
}

export default state
