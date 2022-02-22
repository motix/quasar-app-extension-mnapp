import { initializeApp } from 'firebase/app'
// Main
import { boot } from 'quasar/wrappers'

export default boot(() => {
  const options = process.env.FIREBASE_CONFIG
  initializeApp(options)
})
