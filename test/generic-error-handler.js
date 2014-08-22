module.exports = function noError(err) {
  if (err) { console.log( err.name.red + ': ' + err.message ); }
  should.not.exist(err);
};
