import useConfig from 'services/useConfig'
// Main
import { boot } from 'quasar/wrappers'

export default boot(() => {
  const config = useConfig()

  if (config.docsPageSize === undefined) config.docsPageSize = 25
  if (config.releaseDocsTimeout === undefined) config.releaseDocsTimeout = 5000
})
