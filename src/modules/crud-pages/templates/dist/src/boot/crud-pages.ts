import ListPage from 'src/components/shared/crud-pages/ListPage.vue'
import ViewPage from 'src/components/shared/crud-pages/ViewPage.vue'
import NewPage from 'src/components/shared/crud-pages/NewPage.vue'
// Main
import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  app.component('ListPage', ListPage)
  app.component('ViewPage', ViewPage)
  app.component('NewPage', NewPage)
})
