module.exports = function (api) {
  api.removePath('src/boot/fontawesome-pro.ts')
}

module.exports.revertFiles = [
  'package.json'
]
