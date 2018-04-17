module.exports = function(controls) {
  if (!Array.isArray(controls) && controls) {
    return controls.split();
  } else {
    return controls;
  }
};
