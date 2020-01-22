const objectUtils = {};

/**
 * Checks to see if an object has any identifiable properties beyond standard Object properties
 * that can be used for comparison or evaluation.
 * @param {object} obj the object to check.
 * @returns {boolean} true if the object is empty, false if it contains properties.
 */
objectUtils.isEmpty = function (obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
};

export { objectUtils };
