// Give the function a name to identify the module when filling default values from app config
module.exports = function frameworks () {
  return [
    {
      name: 'vuex',
      type: 'confirm',
      message: '[framework] Vuex installed?',
      default: true
    }
  ]
}
