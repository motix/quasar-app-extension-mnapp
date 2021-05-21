// Give the function a name to identify the module when filling default values from app config
module.exports = function app () {
  return [
    {
      name: 'devServerPort',
      type: 'number',
      message: 'devServer.port',
      default: 8080
    }
  ]
}
