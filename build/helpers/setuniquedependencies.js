module.exports = function(arr) {
  const set = new Set(arr),
    arrSet = [...set];
  return arrSet;
};
