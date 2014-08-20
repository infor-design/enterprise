/***
 *	Wrapper for WebDriverJS and its required settings
 *	@author  ecoyle;
***/
process.env['TEST_BROWSER'] = 'phantomjs';

var colors = require('colors');
var path = require('path');
var webdriver = require('webdriverjs');
var bundle = require("webdriverjs-selenium-bundle");

// Let's introduce ourselves
console.log('SoHo 2.0 Controls - Test Suite'.green);

// Add the Selenium ChromeDriver location to your PATH environment variable.
// This is needed for running tests in Chrome.  ChromeDriver should be automatically
// downloaded when using "npm install" via the "selenium-chromedriver" NPM package.
var chromeDriver = path.join( __dirname, '..', 'node_modules', 'selenium-chromedriver', 'bin'); //'/Applications/chromedriver'; //__dirname + '/../node_modules/selenium-chromedriver/bin';
console.log('Using ChromeDriver executable in path: '.yellow + '"' + chromeDriver + '"');
process.env['PATH'] += ':' + chromeDriver;

// Add PhantomJS location to your PATH environment variable.
// This is needed for running tests with PhantomJS.  PhantomJS should also be downloaded
// when using "npm install" via the "phantomjs" NPM package.
var phantomjs = path.join( __dirname, '..', 'node_modules', 'phantomjs', 'bin');
console.log('Using PhantomJS executable in path: '.yellow + '"' + phantomjs + '"');
process.env['PATH'] += ':' + phantomjs;

// Choose a Browser or Headless Browsing API to run your tests against.
// You can set this option with the environment variable 'TEST_BROWSER'.
// This defaults to Firefox if no variable is found.
var browser = 'chrome';
var supportedTestBrowsers = ['chrome', 'firefox', 'phantomjs'];
for (var i in supportedTestBrowsers) {
  if (supportedTestBrowsers[i] === process.env['TEST_BROWSER']) {
    browser = process.env['TEST_BROWSER'];
  }
}
console.log('Performing tests using '.yellow + browser + ' browser environment.'.yellow);

var capabilities = {
  browserName: browser
};
var options = {
  desiredCapabilities : capabilities,
  host: 'localhost',
  port: 4444
};

// Create the webdriver with our desired options.
var driver = new webdriver.remote( options );

// autostop makes sure that the selenium server is stopped after
// calling end().
driver.use( bundle({autostop: true}) );

module.exports = driver;
