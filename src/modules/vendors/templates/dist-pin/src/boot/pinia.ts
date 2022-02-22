import { createPinia } from 'pinia'
// Main
import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  app.use(createPinia())
})
