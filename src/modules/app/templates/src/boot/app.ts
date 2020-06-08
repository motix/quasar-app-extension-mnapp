/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable camelcase */

import { boot } from 'quasar/wrappers'
import config, { ConfigInstance } from './app/config'
import rules, { RulesInstance } from './app/rules'
import scroll, { ScrollInstance } from './app/scroll'

declare module 'vue/types/vue' {
  interface Vue {
    $m_cfg: ConfigInstance;
    $m_rules: RulesInstance;
    $m_scroll: ScrollInstance;
  }
}

export default boot(({ Vue }) => {
  Vue.prototype.$m_cfg = config
  Vue.prototype.$m_rules = rules(config)
  Vue.prototype.$m_scroll = scroll(config)
})
