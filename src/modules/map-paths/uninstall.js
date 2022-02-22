module.exports = function (api) {
  api.removePath('.mnapp-vite/map-paths.ts')
  api.removePath('.mnapp-vite/map-paths.d.ts')
  api.removePath('tsconfig-map-paths-preset.json')
}

module.exports.revertFiles = [
  'tsconfig.json'
]
