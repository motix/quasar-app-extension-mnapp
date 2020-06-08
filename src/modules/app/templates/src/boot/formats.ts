/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */

import { boot } from 'quasar/wrappers'
import config from './app/config'
import percent from './formats/percent'
import currency from './formats/currency'
import date from './formats/date'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FormatsInstance { // To be augmented
}

declare module 'vue/types/vue' {
  interface Vue {
    $m_formats: FormatsInstance;
  }
}

export default boot(({ Vue }) => {
  Vue.prototype.$m_formats = {
    percent,
    currency,
    ...date(config)
  }
})
