module.exports = function (api) {
  api.render('./templates/dist')

  if (api.appDir.endsWith('\\dev')) {
    api.render('./templates/dev')
  }
}

module.exports.extendPackageJson = {
  scripts: {
    serve: 'quasar dev',
    build: 'quasar build'
  }
}
