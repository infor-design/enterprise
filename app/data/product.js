const path = require('path');
const getJSONFile = require('../src/js/get-json-file');

// Sample Product Data
module.exports = (req, res) => {
  let products = getJSONFile(path.resolve(__dirname, 'products.json'));

  if (req.query.limit) {
    products = products.slice(0, req.query.limit);
  }

  res.setHeader('Content-Type', 'application/json');
  res.json(products);
};
