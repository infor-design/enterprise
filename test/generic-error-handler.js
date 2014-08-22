var chai = require('chai');
var expect = chai.expect;
var should = chai.should();

module.exports = function handleError(err) {
  if (err) { console.log( err.name.red + ': ' + err.message ); }
  expect(err).to.be.undefined;
};
