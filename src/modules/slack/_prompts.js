// Give the function a name to identify the module when filling default values from app config
module.exports = function firebase() {
  return [
    {
      name: 'workspaceUrl',
      type: 'input',
      message: '[slack] Workspace URL',
    },
  ];
};
