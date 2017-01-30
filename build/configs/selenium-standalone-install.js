var ARCH = require('process').arch;

module.exports = {
  version: '2.53.0',
  baseURL: 'http://selenium-release.storage.googleapis.com',
  drivers: {
    chrome: {
      version: '2.21',
      arch: ARCH,
      baseURL: 'https://chromedriver.storage.googleapis.com'
    },
    ie: {
      version: '3.0.0',
      arch: ARCH,
      baseURL: 'https://selenium-release.storage.googleapis.com'
    }
  }
};
