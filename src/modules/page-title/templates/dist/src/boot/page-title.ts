import packageInfo from 'app/package.json'
import useConfig from 'composables/useConfig'
import { boot } from 'quasar/wrappers'

export default boot(() => {
  const config = useConfig()

  if (config.appName === undefined) config.appName = packageInfo.productName
})
