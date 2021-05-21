module.exports = function (api) {
  api.render('./templates/dist')

  if (api.appDir.endsWith('\\dev')) {
    api.render('./templates/dev')
  }
}

module.exports.extendJsonFiles = {
  // tsconfig.json
  'tsconfig.json': {
    extends: './tsconfig-preset'
  }
}
