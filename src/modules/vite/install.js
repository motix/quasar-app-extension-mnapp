/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const { defineInstall, getExtensionConfig } = require('..')
const config = getExtensionConfig()

module.exports = defineInstall(function (api) {
  const packagePath = api.resolve.app('package.json')
  /**
   * @type {{productName: string, description: string}}
   */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {
    productName,
    description: productDescription
  } = require(packagePath)

  api.render('./templates/dist', { config, productName, productDescription })

  api.onExitLog('\x1b[32mvite          • \x1b[0mPlease add \x1b[33mresolve(__dirname, \'./tsconfig.eslint.json\')\x1b[0m to \x1b[47m\x1b[30m.eslintrc.js\x1b[0m under \x1b[33mparserOptions.project\x1b[0m setting.')
})

module.exports.extendPackageJson = {
  scripts: {
    typecheck: 'vue-tsc --noEmit'
  },
  devDependencies: {
    '@quasar/vite-plugin': '^1.0.5',
    '@vitejs/plugin-vue': '^2.2.4',
    '@vue/tsconfig': '^0.1.3',
    vite: '^2.8.6',
    'vue-tsc': '^0.32.1'
  }
}

if (!config.hasModule('firebase')) {
  module.exports.extendPackageJson.scripts.dev = 'vite'
  module.exports.extendPackageJson.scripts['dev:q'] = 'quasar dev'
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
