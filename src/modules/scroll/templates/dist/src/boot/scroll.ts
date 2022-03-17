import useConfig from 'composables/useConfig'
import { boot } from 'quasar/wrappers'

export default boot(() => {
  const config = useConfig()

  if (config.scrollDuration === undefined) config.scrollDuration = 500
  if (config.scrollOffset === undefined) config.scrollOffset = 50
})
