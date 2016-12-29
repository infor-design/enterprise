const extractNameFromPath = require('./extractnamefrompath.js');

module.exports = function(arr) {
  let uniqDependencies = new Set();
  if (Array.isArray(arr)) {
    for (let obj of arr) {
      uniqDependencies.add(extractNameFromPath(obj.fileFound));
    }
    return uniqDependencies;
  }
};
