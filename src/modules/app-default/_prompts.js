// Give the function a name to identify the module when filling default values from app config
module.exports = function appDefault () {
  return [
    {
      name: 'devServerPort',
      type: 'number',
      message: '[app-default] Quasar devServer.port (Vite port will be this value plus 1)',
      default: 8080
    },
    {
      name: 'https',
      type: 'confirm',
      message: '[app-default] Use HTTPS?',
      default: false
    }
  ]
}
