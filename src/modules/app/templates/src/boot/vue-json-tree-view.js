import TreeView from 'vue-json-tree-view'
import { boot } from 'quasar/wrappers'

export default boot(({ Vue }) => {
  process.env.DEV && Vue.use(TreeView)
})
