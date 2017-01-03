const extractControls = require('./extractcontrols.js');

module.exports = function(hashMap, setCollection, excludeControls = []) {
  for (let name of setCollection) {
    if (hashMap[name] && !excludeControls.includes(name) && name !== 'initialize') {
      let arrHashMap = extractControls(hashMap[name]);
      for (let control of arrHashMap) {
        setCollection.add(control);
      }
    } else {
      setCollection.add(name);
    }
  }

  return setCollection;
};
