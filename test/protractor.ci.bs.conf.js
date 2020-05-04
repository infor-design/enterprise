/* eslint-disable */
const basePath = __dirname;
const { SpecReporter } = require('jasmine-spec-reporter');
const group = process.env.GROUP;
const specs = require('./helpers/detect-custom-spec-list')('e2e', process.env.PROTRACTOR_SPECS, group || 'all');

const theme = process.env.ENTERPRISE_THEME || 'soho'
let browserstackBuildID = `${Date.now()} : ${theme} theme : ci:bs e2e`;

if (process.env.TRAVIS_BUILD_NUMBER) {
  browserstackBuildID = `Travis Build No. ${process.env.TRAVIS_BUILD_NUMBER} : ci:bs e2e : group ${group}`;
}

process.env.isBrowserStack = true;

exports.config = {
  params: {
    theme
  },
  allScriptsTimeout: 20000,
  logLevel: 'INFO',
  specs: specs,
  seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
  SELENIUM_PROMISE_MANAGER: false,
  baseUrl: 'http://master-enterprise.demo.design.infor.com/',
  jasmineNodeOpt: {
    defaultTimeoutInterval: 30000,
    showColors: true
  },
  commonCapabilities: {
    'browserstack.user': process.env.BROWSERSTACK_USERNAME,
    'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
    'browserstack.debug': true,
    'browserstack.video': true,
    'browserstack.local': false,
    'browserstack.networkLogs': false,
    'browserstack.timezone': 'New_York',
    build: browserstackBuildID,
    loggingPrefs: {
      driver: 'INFO',
      server: 'INFO',
      browser: 'SEVERE'
    },
    name: `${theme} theme ci:bs e2e tests`,
    project: 'ids-enterprise-e2e-ci'
  },
  multiCapabilities: [
    {
      'os' : 'OS X',
      'os_version' : 'Mojave',
      'browserName' : 'Chrome',
      'browser_version' : '78.0',
      'browserstack.local' : 'false',
      'browserstack.video' : 'false',
      'browserstack.timezone' : 'New_York',
      'browserstack.selenium_version' : '3.5.2',
      'browserstack.seleniumLogs' : 'false'
    }
  ],
	plugins: [
		{
			// The module name
			package: 'protractor-image-comparison',
			// Some options, see the docs for more
			options: {
				baselineFolder: `${basePath}/baseline`,
				screenshotPath: `${basePath}/.tmp/`,
        autoSaveBaseline: true,
        ignoreAntialiasing: true,
        disableCSSAnimation: true,
        debug: false,
        hideScrollBars: true
			},
		}
	],
  onPrepare: () => {
    global.requireHelper = (filename) => require(`${basePath}/helpers/${filename}.js`);
    browser.ignoreSynchronization = true;
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: { displayStacktrace: 'specs' }
    }));
  }
};

exports.config.multiCapabilities.forEach((caps) => {
  for (const i in exports.config.commonCapabilities) {
    caps[i] = caps[i] || exports.config.commonCapabilities[i];
  }
});
