// Give the function a name to identify the module when filling default values from app config
module.exports = function authentication () {
  return [
    {
      name: 'isAuthenticatedUrl',
      type: 'input',
      message: 'isAuthenticatedUrl',
      default: 'api/Authentication/is-authenticated'
    },
    {
      name: 'currentUserUrl',
      type: 'input',
      message: 'currentUserUrl',
      default: 'api/Authentication/current-user'
    },
    {
      name: 'loginUrl',
      type: 'input',
      message: 'loginUrl',
      default: '/SignIn'
    }
  ]
}
