import _, { LoDashStatic } from 'lodash'
import { boot } from 'quasar/wrappers'

declare module 'vue/types/vue' {
  interface Vue {
    $_: LoDashStatic;
  }
}

export default boot(({ Vue }) => {
  Vue.prototype.$_ = _
})
