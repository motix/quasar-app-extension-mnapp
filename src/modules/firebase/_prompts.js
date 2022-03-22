// Give the function a name to identify the module when filling default values from app config
module.exports = function firebase() {
  return [
    {
      name: 'project',
      type: 'input',
      message: '[firebase] Project',
    },
    {
      name: 'targetName',
      type: 'input',
      message: '[firebase] Target name',
    },
    {
      name: 'siteId',
      type: 'input',
      message: '[firebase] Site ID',
    },
    {
      name: 'authEmulatorPort',
      type: 'input',
      message: '[firebase] emulators.auth.port',
      default: '9099',
    },
    {
      name: 'functionsEmulatorPort',
      type: 'input',
      message: '[firebase] emulators.functions.port',
      default: '5001',
    },
    {
      name: 'firestoreEmulatorPort',
      type: 'input',
      message: '[firebase] emulators.firestore.port',
      default: '6060',
    },
  ];
};
