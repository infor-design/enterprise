const extractNameFromPath = require('./extractnamefrompath.js'),
  setUniqueDependencies = require('./setuniquedependencies.js');

module.exports = function(arr) {
  let uniqDependencies = [];
  if (Array.isArray(arr)) {
    for (let obj of arr) {
      uniqDependencies.push(extractNameFromPath(obj.fileFound));
    }
    return setUniqueDependencies(uniqDependencies);
  }
};
