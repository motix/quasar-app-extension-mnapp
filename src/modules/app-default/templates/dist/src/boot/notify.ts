import { Notify } from 'quasar'
// Main
import { boot } from 'quasar/wrappers'

export default boot(() => {
  Notify.setDefaults({
    color: 'grey-6'
  })
})
