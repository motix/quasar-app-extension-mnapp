module.exports = function () {
  return [
    {
      name: 'isAuthenticatedUrl',
      type: 'string',
      message: 'isAuthenticatedUrl',
      default: 'api/Authentication/is-authenticated'
    },
    {
      name: 'currentUserUrl',
      type: 'string',
      message: 'currentUserUrl',
      default: 'api/Authentication/current-user'
    },
    {
      name: 'loginUrl',
      type: 'string',
      message: 'loginUrl',
      default: '/SignIn'
    }
  ]
}
