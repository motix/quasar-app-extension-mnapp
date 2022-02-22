const getExtensionConfig = require('../extension-config')
const config = getExtensionConfig()

module.exports = function (api) {
  const packagePath = api.resolve.app('package.json')
  const {
    productName,
    description: productDescription
  } = require(packagePath)

  api.render('./templates/dist', { config, productName, productDescription })

  if (api.appDir.endsWith('\\dev')) {
    api.render('./templates/dev')
  }

  api.onExitLog('\x1b[32mvite          • \x1b[0mPlease add \x1b[33mresolve(__dirname, \'./tsconfig.eslint.json\')\x1b[0m to \x1b[47m\x1b[30m.eslintrc.js\x1b[0m under \x1b[33mparserOptions.project\x1b[0m setting.')
}

module.exports.extendPackageJson = {
  scripts: {
    typecheck: 'vue-tsc --noEmit'
  },
  devDependencies: {
    '@quasar/vite-plugin': '^1.0.4',
    '@vitejs/plugin-vue': '^2.2.0',
    '@vue/tsconfig': '^0.1.3',
    vite: '^2.8.1',
    'vue-tsc': '^0.31.2'
  }
}

if (config.hasModule('firebase')) {
  module.exports.extendPackageJson.scripts.dev = 'cross-env FIREBASE_ENV=DEV vite'
} else {
  module.exports.extendPackageJson.scripts.dev = 'vite'
}

module.exports.extendJsonFiles = {
  // tsconfig.json
  'tsconfig.json': {
    references: [{ path: './tsconfig.node.json' }]
  }
}

if (!config.hasModule('map-paths')) {
  // tsconfig.json
  module.exports.extendJsonFiles['tsconfig.json'].extends = './tsconfig-vite-preset.json'
}
