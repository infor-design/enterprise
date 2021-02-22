/* eslint-disable */
const basePath = __dirname;
const { SpecReporter } = require('jasmine-spec-reporter');
const group = process.env.GROUP;
const specs = require('./helpers/detect-custom-spec-list')('e2e', process.env.PROTRACTOR_SPECS, group || 'all');

exports.config = {
  params: {
    theme:  'new'
  },
  allScriptsTimeout: 120000,
  logLevel: 'INFO',
  specs: specs,
  SELENIUM_PROMISE_MANAGER: false,
  capabilities: {
    browserName: 'chrome',
    loggingPrefs: {
      driver: 'INFO',
      server: 'INFO',
      browser: 'SEVERE'
    },
    chromeOptions: {
      args: [
        '--headless',
        '--disable-gpu',
        '--window-size=1200,800',
        '--disable-dev-shm-usage',
        '--no-sandbox'
      ]
   }
  },
  directConnect: true,
  baseUrl: 'http://localhost:4000',
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: () => {}
  },
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
        disableCSSAnimation: false,
        debug: false,
        hideScrollBars: true,
        clearRuntimeFolder: true
			},
		}
	],
  onPrepare: () => {
    global.requireHelper = (filename) => require(`${basePath}/helpers/${filename}.js`);
    browser.ignoreSynchronization = true;

    jasmine.getEnv().addReporter(new SpecReporter({
      spec: { displayStacktrace: 'specs' }
    }));

    return browser.getProcessedConfig().then((cap) => {
      browser.browserName = cap.capabilities.browserName.toLowerCase();
      if (browser.browserName === 'chrome') {
        return browser.driver.manage().window().setSize(1200, 800);
      }
    });
  }
};
