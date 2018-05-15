const path = require('path');
const getJSONFile = require('../src/js/get-json-file');

module.exports = (req, res, next) => {
  const data = getJSONFile(path.resolve(__dirname, 'projects.json'));
  res.setHeader('Content-Type', 'application/json');
  res.json(data);
  next();
};
