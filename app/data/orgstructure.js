const path = require('path');
const getJSONFile = require('../src/js/get-json-file');

module.exports = (req, res, next) => {
  const orgData = getJSONFile(path.resolve(__dirname, 'orgstructure-original.json'));

  function setBasePath(imgPath) {
    return `${req.protocol}://${req.host}${imgPath}`;
  }

  function detectPictures(record) {
    if (typeof record.Picture === 'string') {
      record.Picture = setBasePath(record.Picture);
    }
    if (Array.isArray(record.children)) {
      record.children.forEach((childRecord) => {
        detectPictures(childRecord);
      });
    }
  }

  // For IDS demo sites, append the host to the image paths
  if (req.hostname.indexOf('demo.design.infor.com') > -1) {
    orgData.forEach((record) => {
      detectPictures(record);
    });
  }

  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(orgData));
  next();
};
