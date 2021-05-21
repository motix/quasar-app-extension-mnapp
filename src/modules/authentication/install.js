module.exports = function (api) {
  api.render('./templates/dist', {
    prompts: api.prompts
  })

  if (api.appDir.endsWith('\\dev')) {
    api.render('./templates/dev')
  }
}
