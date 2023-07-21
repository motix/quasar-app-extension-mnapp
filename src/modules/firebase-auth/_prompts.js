const { definePrompts } = require('..');

module.exports = definePrompts(function () {
  return [
    {
      name: 'userRoles',
      type: 'input',
      message:
        '[firebase-auth] Please specify User Roles other than "admin" and "user".',
      default: '',
    },
  ];
});
