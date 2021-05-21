import { boot } from 'quasar/wrappers'
import useConfig from 'composables/use-config'

declare module 'composables/use-config' {
  interface Config {
    scrollDuration?: number;
    scrollOffset?: number;
  }
}

export default boot(() => {
  const config = useConfig()

  if (config.scrollDuration === undefined) config.scrollDuration = 500
  if (config.scrollOffset === undefined) config.scrollOffset = 50
})
