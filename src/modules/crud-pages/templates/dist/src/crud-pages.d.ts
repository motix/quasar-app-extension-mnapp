export { }

import ListPage from 'components/shared/crud-pages/ListPage.vue'
import NewPage from 'components/shared/crud-pages/NewPage.vue'
import ViewPage from 'components/shared/crud-pages/ViewPage.vue'

declare module '@vue/runtime-core' {
  interface GlobalComponents {
    ListPage: typeof ListPage;
    ViewPage: typeof ViewPage;
    NewPage: typeof NewPage;
  }
}
