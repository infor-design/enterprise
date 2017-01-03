const path = require('path');

module.exports = function(arrControls) {
  let strControls = '';

  if (arrControls) {
    let controls = arrControls.map((strPath) => { return path.basename(strPath, '.js'); });
    strControls = controls.join(', ');
  }

  return strControls;

};
