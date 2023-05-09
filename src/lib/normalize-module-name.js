/**
 * @param {string} str
 */
module.exports = function (str) {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
};
