const data = require('../src/js/get-junk-dropdown-data');

module.exports = (req, res, next) => {
  res.json(data);
  next();
};
