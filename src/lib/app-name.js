module.exports = function () {
  const packageJson = require('../../package.json');
  let name = packageJson.name;

  name = name.substring(name.lastIndexOf('/'));
  name = name.substring('quasar-app-extension-'.length + 1);

  return name;
};
