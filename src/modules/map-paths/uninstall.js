module.exports = function (api) {
  api.removePath('tsconfig-preset.json')
}

module.exports.revertFiles = [
  'tsconfig.json'
]
