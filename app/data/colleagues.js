const getJSONFile = require('../src/js/get-json-file');

// Handles the sending of an incoming JSON file
function sendJSONFile(filepath, req, res, next) {
  const data = getJSONFile(`${filepath}.json`);
  res.setHeader('Content-Type', 'application/json');
  res.json(data);
  next();
}

module.exports = (req, res, next) => {
  if (req.query.favorites) {
    sendJSONFile('colleagues-favorite', req, res, next);
    return;
  }

  sendJSONFile('colleagues-all', req, res, next);
};
