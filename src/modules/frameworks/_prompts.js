/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { definePrompts } = require('..')

// Give the function a name to identify the module when filling default values from app config
module.exports = definePrompts(function frameworks () {
  return [
    {
      name: 'vuex',
      type: 'confirm',
      message: '[framework] Vuex installed?',
      default: true
    }
  ]
})
