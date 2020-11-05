/* eslint-disable */
const basePath = __dirname;
const { SpecReporter } = require('jasmine-spec-reporter');
const browserstack = require('browserstack-local');
const specs = require('./helpers/detect-custom-spec-list')('e2e', process.env.PROTRACTOR_SPECS);

const theme = process.env.ENTERPRISE_THEME || 'soho'
let browserstackBuildID = `${Date.now()} : ci:bs e2e`;

process.env.isBrowserStack = true;

exports.config = {
  params: {
    theme
  },
  allScriptsTimeout: 12000,
  getPageTimeout: 10000,
  logLevel: 'DEBUG',
  troubleshoot: true,
  specs: specs,
  seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
  SELENIUM_PROMISE_MANAGER: false,
  baseUrl: 'http://localhost:4000',
  jasmineNodeOpt: {
    defaultTimeoutInterval: 10000,
    showColors: true
  },
  commonCapabilities: {
    'browserstack.user': process.env.BROWSERSTACK_USERNAME,
    'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
    'browserstack.debug': true,
    'browserstack.local': true,
    'browserstack.networkLogs' : true,
    build: browserstackBuildID,
    loggingPrefs: {
      driver: 'INFO',
      server: 'INFO',
      browser: 'SEVERE'
    },
    name: `${theme} theme local tunnel e2e tests`,
  },
  multiCapabilities: [
    {
      browserName: 'chrome',
      resolution: '1280x800',
      os_version: '10',
      os: 'Windows'
    },
    {
      browserName: 'Edge',
      resolution: '1280x800',
      browser_version: '17.0',
      os_version: '10',
      os: 'Windows'
    },
    {
      browserName: 'Firefox',
      browser_version: '61.0',
      resolution: '1280x800',
      os_version: '10',
      os: 'Windows',
      'browserstack.geckodriver' : '0.21.0'
    },
    {
      browserName: 'Safari',
      browser_version: '11.0',
      resolution: '1280x960',
      os_version: 'High Sierra',
      os: 'OS X',
      'browserstack.safari.driver' : '2.48'
    },
    {
      browserName: 'IE',
      browser_version: '11.0',
      resolution: '1280x800',
      os_version: '10',
      os: 'Windows',
      'browserstack.ie.noFlash': 'true',
      'browserstack.ie.driver': '2.41',
      'browserstack.selenium_version': '3.11.0',
    }
  ],
  beforeLaunch: () => {
    return new Promise((resolve, reject) => {
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start({ key: exports.config.commonCapabilities['browserstack.key'] }, (error) => {
        if (error) {
          return reject(error);
        }
        resolve();
      });
    });
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
  },
  afterLaunch: () => {
    return new Promise((resolve) => {
      exports.bs_local.stop(resolve);
    });
  }
};

exports.config.multiCapabilities.forEach((caps) => {
  for (const i in exports.config.commonCapabilities) {
    caps[i] = caps[i] || exports.config.commonCapabilities[i];
  }
});
