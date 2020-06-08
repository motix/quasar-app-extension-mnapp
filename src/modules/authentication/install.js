module.exports = function (api) {
  api.render('./templates', {
    prompts: api.prompts
  })
}
