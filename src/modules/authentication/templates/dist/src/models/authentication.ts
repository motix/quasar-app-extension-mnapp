import { AxiosResponse } from 'axios'

export interface Role {
  id: string;
  name: string;
}

export interface User {
  id: string;
  isActive: boolean;
  email: string;
  roles: Role[];
}

export interface AxiosWaitingListItem {
  callMethod: () => Promise<AxiosResponse<never>>;
  resolve: (value: AxiosResponse<never> | PromiseLike<AxiosResponse<never>>) => void;
  reject: (reason?: unknown) => void;
}
