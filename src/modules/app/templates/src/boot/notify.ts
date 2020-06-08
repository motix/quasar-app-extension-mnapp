/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/camelcase */

import { Notify } from 'quasar'
import { boot } from 'quasar/wrappers'

declare module 'vue/types/vue' {
  interface Vue {
    $m_notifyLoadDataError (): void;
    $m_notifyValidationError (): void;
    $m_notifyCreateDataSuccessAndRedirect (): void;
    $m_notifyCreateDataError (): void;
    $m_notifySaveDataSuccess (): void;
    $m_notifySaveDataError (): void;
    $m_notifyDeleteDataSuccessAndRedirect (): void;
    $m_notifyDeleteDataError (): void;
  }
}

export default boot(({ Vue }) => {
  Notify.setDefaults({
    color: 'accent'
  })

  Vue.prototype.$m_notifyLoadDataError = function () {
    this.$q.notify({
      message: 'Load data error. Refresh the page to try again or contact support.',
      color: 'negative'
    })
  }

  Vue.prototype.$m_notifyValidationError = function () {
    this.$q.notify({
      message: 'Invalid data input. Please revise marked fields.',
      color: 'negative'
    })
  }

  Vue.prototype.$m_notifyCreateDataSuccessAndRedirect = function () {
    this.$q.notify({
      message: 'Data created successfully. Redirecting to details page.',
      color: 'positive'
    })
  }

  Vue.prototype.$m_notifyCreateDataError = function () {
    this.$q.notify({
      message: 'Create data error. Refresh the page to try again or contact support.',
      color: 'negative'
    })
  }

  Vue.prototype.$m_notifySaveDataSuccess = function () {
    this.$q.notify({
      message: 'Data saved successfully.',
      color: 'positive'
    })
  }

  Vue.prototype.$m_notifySaveDataError = function () {
    this.$q.notify({
      message: 'Save data error. Refresh the page to try again or contact support.',
      color: 'negative'
    })
  }

  Vue.prototype.$m_notifyDeleteDataSuccessAndRedirect = function () {
    this.$q.notify({
      message: 'Data deleted successfully. Redirecting to list page.',
      color: 'positive'
    })
  }

  Vue.prototype.$m_notifyDeleteDataError = function () {
    this.$q.notify({
      message: 'Delete data error. Refresh the page to try again or contact support.',
      color: 'negative'
    })
  }
})
