const setHashMapUniqueDependencies = require('./sethashmapuniquedependencies.js');

module.exports = function(hashMap, setCollection, excludeControls = []) {
  for (let name of setCollection) {
    if (hashMap[name] && !excludeControls.includes(name) && name !== 'initialize') {
      let arrHashMap = setHashMapUniqueDependencies(hashMap[name]);
      for (let control of arrHashMap) {
        setCollection.add(control);
      }
    } else {
      setCollection.add(name);
    }
  }

  return setCollection;
};
