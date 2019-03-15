/* eslint-disable */
const basePath = __dirname;
const { SpecReporter } = require('jasmine-spec-reporter');
const protractorImageComparison = require('protractor-image-comparison');
const specs = require('./helpers/detect-custom-spec-list')('e2e', process.env.PROTRACTOR_SPECS);

exports.config = {
  params: {
    theme:  process.env.ENTERPRISE_THEME || 'light'
  },
  allScriptsTimeout: 120000,
  logLevel: 'INFO',
  specs: specs,
  SELENIUM_PROMISE_MANAGER: false,
  capabilities: {
    browserName: 'chrome',
    shardTestFiles: true,
    maxInstances: 2,
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
  onPrepare: () => {
    global.requireHelper = (filename) => require(`${basePath}/helpers/${filename}.js`);
    browser.ignoreSynchronization = true;
    if (process.env.TRAVIS) {
      browser.protractorImageComparison = new protractorImageComparison({
        baselineFolder: `${basePath}/baseline`,
        screenshotPath: `${basePath}/.tmp/`,
        autoSaveBaseline: false,
        ignoreAntialiasing: true,
        disableCSSAnimation: true,
        debug: false
      });
    }

    jasmine.getEnv().addReporter(new SpecReporter({
      spec: { displayStacktrace: false }
    }));

    return browser.getProcessedConfig().then((cap) => {
      browser.browserName = cap.capabilities.browserName.toLowerCase();
      if (browser.browserName === 'chrome') {
        return browser.driver.manage().window().setSize(1200, 800);
      }
    });
  }
};
