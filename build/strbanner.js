const extractNameFromPath = require('./helpers/extractnamefrompath.js');

module.exports = function(arrControls) {
  let strControls = '';

  if (arrControls) {
    let controls = arrControls.map((path) => { return extractNameFromPath(path); });
    strControls = controls.join(', ');
  }

  return strControls;

};
