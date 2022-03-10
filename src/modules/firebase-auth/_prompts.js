/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { definePrompts } = require('..')

// Give the function a name to identify the module when filling default values from app config
module.exports = definePrompts(function firebaseAuth () {
  return [
    {
      name: 'userRoles',
      type: 'input',
      message: '[firebase-auth] Please specify User Roles other than "admin" and "user".',
      default: ''
    }
  ]
})
