import useConfig from 'services/useConfig'
// Main
import { boot } from 'quasar/wrappers'

export default boot(() => {
  const config = useConfig()

  config.docsPageSize = 25
  config.releaseDocsTimeout = 5000
})
