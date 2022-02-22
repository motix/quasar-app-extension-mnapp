import { createPinia } from 'pinia'
import useConfig from 'services/useConfig'
// Main
import { boot } from 'quasar/wrappers'

export default boot(({ app }) => {
  const config = useConfig()

  config.docsPageSize = 25
  config.releaseDocsTimeout = 5000

  app.use(createPinia())
})
