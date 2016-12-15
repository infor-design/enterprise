const setHashMapUniqueDependencies = require('./sethashmapuniquedependencies.js'),
    basePusher = require('./basepusher.js');

module.exports = function(hashMap, collection) {
  for (let name of collection) {
    if (hashMap[name]) {
      let arrHashMap = setHashMapUniqueDependencies(hashMap[name]);
      collection = basePusher(arrHashMap, collection);
    }
  }
  return collection;
};
