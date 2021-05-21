import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { Store } from 'vuex'
import { Dialog } from 'quasar'
import { AxiosWaitingListItem } from 'models/authentication'
import authenticationApi from 'api/authentication'
import { StateInterface } from 'store/index'
import { AuthenticationGetters, authenticationMutations } from 'store/authentication'
import LoginExpiredDialog from 'components/authentication/LoginExpiredDialog.vue'

// For development purpose
const delayCalls = false
const delayTimeout = 1000

interface SafeAxiosError<T = never> extends AxiosError<T> {
  isAuthenticatedError: SafeAxiosError<T>;
  secondTryError: SafeAxiosError<T>;
}

let _store: Store<StateInterface>

export function setStore (store: Store<StateInterface>) {
  _store = store
}

export default function () {
  function safeCall<T = never> (callMethod: () => Promise<AxiosResponse<T>>) {
    return new Promise<AxiosResponse<T>>((resolve, reject) => {
      callMethod()
        .then(resp => resolve(resp))
        .catch((err: SafeAxiosError<T>) => {
          if (!err.isAxiosError) {
            reject(err)
            return
          }

          authenticationApi.isAuthenticated()
            .then(auResp => {
              if (auResp.data === false) {
                if ((_store.getters as AuthenticationGetters)['authentication/isAxiosWaitingListEmpty']) {
                  _store.commit(`authentication/${authenticationMutations.ADD_AXIOS_CALL}`, { callMethod, resolve, reject })
                  Dialog
                    .create({
                      component: LoginExpiredDialog
                    })
                    .onOk(() => {
                      _store.commit(`authentication/${authenticationMutations.EXECUTE_AND_CLEAR_AXIOS_WAITING_LIST}`,
                        (item: AxiosWaitingListItem) => {
                          item.callMethod()
                            .then(resp2 => item.resolve(resp2))
                            .catch((err2: SafeAxiosError<never>) => {
                              console.error('Network error after user confirms login', err2.config.url)
                              err.secondTryError = err2
                              item.reject(err)
                            })
                        })
                    })
                } else {
                  _store.commit(`authentication/${authenticationMutations.ADD_AXIOS_CALL}`, { callMethod, resolve, reject })
                }
              } else {
                reject(err)
              }
            })
            .catch((auErr: SafeAxiosError<T>) => {
              console.error('Is authenticated request error', auErr.config.url)
              err.isAuthenticatedError = auErr
              reject(err)
            })
        })
    })
  }

  function safeGet<T = never> (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    if (delayCalls) {
      return new Promise((resolve, reject) => {
        console.warn('Delaying safeGet')
        setTimeout(() => {
          safeCall<T>(() => axios.get<T>(url, config))
            .then(value => resolve(value))
            .catch(reason => reject(reason))
        }, delayTimeout)
      })
    } else {
      return safeCall<T>(() => axios.get<T>(url, config))
    }
  }

  function safePost<T = never> (url: string, data?: T, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    if (delayCalls) {
      return new Promise((resolve, reject) => {
        console.warn('Delaying safeGet')
        setTimeout(() => {
          safeCall<T>(() => axios.post<T>(url, data, config))
            .then(value => resolve(value))
            .catch(reason => reject(reason))
        }, delayTimeout)
      })
    } else {
      return safeCall<T>(() => axios.post<T>(url, data, config))
    }
  }

  function safePut<T = never> (url: string, data?: T, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    if (delayCalls) {
      return new Promise((resolve, reject) => {
        console.warn('Delaying safeGet')
        setTimeout(() => {
          safeCall<T>(() => axios.put<T>(url, data, config))
            .then(value => resolve(value))
            .catch(reason => reject(reason))
        }, delayTimeout)
      })
    } else {
      return safeCall<T>(() => axios.put<T>(url, data, config))
    }
  }

  function safeDelete<T = never> (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    if (delayCalls) {
      return new Promise((resolve, reject) => {
        console.warn('Delaying safeGet')
        setTimeout(() => {
          safeCall<T>(() => axios.delete<T>(url, config))
            .then(value => resolve(value))
            .catch(reason => reject(reason))
        }, delayTimeout)
      })
    } else {
      return safeCall<T>(() => axios.delete<T>(url, config))
    }
  }

  return {
    safeGet,
    safePost,
    safePut,
    safeDelete
  }
}
