module.exports = function(arrHashMap, arrBases) {
  for (let i of arrHashMap) {
    if(!arrBases.includes(i)) {
      arrBases.push(i);
    }
  }
  return arrBases;
};
