const data = require('../src/js/get-junk-dropdown-data');

module.exports = (req, res) => {
  res.json(data);
};
