export { }

import ListPage from 'components/shared/crud-pages/ListPage.vue'
import ViewPage from 'components/shared/crud-pages/ViewPage.vue'
import NewPage from 'components/shared/crud-pages/NewPage.vue'

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    ListPage: typeof ListPage
    ViewPage: typeof ViewPage
    NewPage: typeof NewPage
  }
}
