module.exports = function handleError(err) {
  if (err) { console.log( err.name.red + ': ' + err.message ); }
  should.not.exist(err);
};
