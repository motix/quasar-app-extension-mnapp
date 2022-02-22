// Give the function a name to identify the module when filling default values from app config
module.exports = function firebase () {
  return [
    {
      name: 'features',
      type: 'input',
      message: `[firebase] Which Firebase features to install?
- [aut] Authentication
- [str] Firestore
`,
      default: 'aut,str'
    },
    {
      name: 'userRoles',
      type: 'input',
      message: '[firebase-auth] Please specify User Roles other than "admin" and "user" if Authentication was selected above.',
      default: ''
    },
    {
      name: 'authEmulatorPort',
      type: 'input',
      message: '[firebase] emulators.auth.port',
      default: '9099'
    },
    {
      name: 'functionsEmulatorPort',
      type: 'input',
      message: '[firebase] emulators.functions.port',
      default: '5001'
    },
    {
      name: 'firestoreEmulatorPort',
      type: 'input',
      message: '[firebase] emulators.firestore.port',
      default: '6060'
    }
  ]
}
