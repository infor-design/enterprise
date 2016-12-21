const path = require('path');

module.exports = function(arr) {
  let uniqDependencies = new Set();
  if (Array.isArray(arr)) {
    for (let obj of arr) {
      uniqDependencies.add(path.basename(obj.fileFound, '.js'));
    }
    return uniqDependencies;
  }
};
