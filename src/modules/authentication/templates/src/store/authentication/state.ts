export interface AuthenticationStateInterface {
  currentUser: Member | null;
  axiosWaitingList: Array<AxiosWaitingListItem>;
}

export interface MemberRole {
  id: string;
  name: string;
}

export interface Member {
  id: string;
  isActive: boolean;
  email: string;
  roles: MemberRole[];
}

export interface AxiosWaitingListItem {
  callMethod: Function;
  resolve: Function;
  reject: Function;
}

const state: AuthenticationStateInterface = {
  currentUser: null,
  axiosWaitingList: []
}

export default state
