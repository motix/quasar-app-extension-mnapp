module.exports = function () {
  const pjson = require('../../package.json');
  let name = pjson.name;

  name = name.substring(name.lastIndexOf('/'));
  name = name.substring('quasar-app-extension-'.length + 1);

  return name;
};
