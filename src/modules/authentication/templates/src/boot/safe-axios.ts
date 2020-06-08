/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */

import { axios } from 'boot/axios'
import { Store } from 'vuex'
import { boot } from 'quasar/wrappers'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { StoreInterface } from 'store/index'
import { ADD_AXIOS_CALL, EXECUTE_AND_CLEAR_AXIOS_WAITING_LIST } from '../store/authentication/mutations'
import authenticationApi from '../api/authentication'

declare module 'vue/types/vue' {
  interface Vue {
    $m_axiosSafeGet (url: string, config?: AxiosRequestConfig): Promise<unknown>;
    $m_axiosSafePost (url: string, data?: any, config?: AxiosRequestConfig): Promise<unknown>;
    $m_axiosSafePut (url: string, data?: any, config?: AxiosRequestConfig): Promise<unknown>;
    $m_axiosSafeDelete (url: string, config?: AxiosRequestConfig): Promise<unknown>;
  }
}

export default boot<Store<StoreInterface>>(async ({ store, Vue }) => {
  // If importing component without splitting it into a chunk and the component is declared as Vue.extend
  // the Quasar components are not regconized. Can't figure out why.
  // import LoginExpiredDialog from 'components/LoginExpiredDialog.vue'
  const LoginExpiredDialog = (await import('components/LoginExpiredDialog.vue')).default

  function safeCall (vm: Vue, callMethod: () => Promise<AxiosResponse<any>>) {
    return new Promise((resolve, reject) => {
      callMethod()
        .then(resp => resolve(resp))
        .catch(err => {
          authenticationApi.isAuthenticated()
            .then(auResp => {
              if (auResp.data === false) {
                if (store.getters['authentication/isAxiosWaitingListEmpty']) {
                  store.commit(`authentication/${ADD_AXIOS_CALL}`, { callMethod, resolve, reject })
                  vm.$q
                    .dialog({
                      component: LoginExpiredDialog
                    })
                    .onOk(() => {
                      store.commit(`authentication/${EXECUTE_AND_CLEAR_AXIOS_WAITING_LIST}`,
                        (currentCallMethod: () => Promise<AxiosResponse<any>>,
                          currentResolve: (value?: unknown) => void,
                          currentReject: (reason?: any) => void) => {
                          currentCallMethod()
                            .then(resp2 => currentResolve(resp2))
                            .catch(err2 => {
                              console.error('Network error after user confirms login', err2.config.url)
                              err.secondTryError = err2
                              currentReject(err)
                            })
                        })
                    })
                } else {
                  store.commit(`authentication/${ADD_AXIOS_CALL}`, { callMethod, resolve, reject })
                }
              } else {
                reject(err)
              }
            })
            .catch(auErr => {
              console.error('Is authenticated request error', auErr.config.url)
              err.isAuthenticatedError = auErr
              reject(err)
            })
        })
    })
  }

  Vue.prototype.$m_axiosSafeGet = function (url: string, config?: AxiosRequestConfig) {
    return safeCall(this, () => axios.get(url, config))
  }

  Vue.prototype.$m_axiosSafePost = function (url: string, data?: any, config?: AxiosRequestConfig) {
    return safeCall(this, () => axios.post(url, data, config))
  }

  Vue.prototype.$m_axiosSafePut = function (url: string, data?: any, config?: AxiosRequestConfig) {
    return safeCall(this, () => axios.put(url, data, config))
  }

  Vue.prototype.$m_axiosSafeDelete = function (url: string, config?: AxiosRequestConfig) {
    return safeCall(this, () => axios.delete(url, config))
  }
})
