/* eslint-disable */
const basePath = __dirname;
const { SpecReporter } = require('jasmine-spec-reporter');
const specs = require('./helpers/detect-custom-spec-list')('e2e', process.env.PROTRACTOR_SPECS);

exports.config = {
  params: {
    theme:  'new'
  },
  allScriptsTimeout: 120000,
  logLevel: 'DEBUG',
  specs: specs,
  SELENIUM_PROMISE_MANAGER: false,
  capabilities: {
    browserName: 'chrome' || 'firefox',
    loggingPrefs: {
      driver: 'INFO',
      server: 'INFO',
      browser: 'SEVERE'
    }
  },
  directConnect: true,
  baseUrl: 'http://localhost:4000',
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 120000,
    print: () => {}
  },
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
