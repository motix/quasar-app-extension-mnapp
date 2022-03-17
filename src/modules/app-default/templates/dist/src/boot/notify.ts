import { Notify } from 'quasar'
import { boot } from 'quasar/wrappers'

export default boot(() => {
  Notify.setDefaults({
    color: 'grey-6'
  })
})
