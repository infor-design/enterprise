const { SpecReporter } = require('jasmine-spec-reporter');
const browserstack = require('browserstack-local');

exports.config = {
  allScriptsTimeout: 30000,
  specs: [
    '**/e2e/*.e2e-spec.js',
    'async_await.js'
  ],
  seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
  SELENIUM_PROMISE_MANAGER: false,
  capabilities: {
    'browserstack.user': process.env.BROWSER_STACK_USERNAME,
    'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY,
    'browserstack.debug': true,
    'browserstack.local': true,
    build: 'protractor-browserstack',
    name: 'functional test',
    browserName: 'Safari',
    browser_version: '11.0'
  },
  multiCapabilities: [
    {
      browserName: 'Chrome',
      browser_version: '63.0'
    },
    {
      browserName: 'Safari',
      browser_version: '11.0',
      os_version: 'High Sierra'
    },
    {
      browserName: 'Firefox',
      browser_version: '57.0'
    },
    {
      browserName: 'IE',
      browser_version: '11.0'
    },
    {
      browserName: 'Edge'
    }
  ],
  beforeLaunch: () => {
    return new Promise((resolve, reject) => {
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start({'key': exports.config.commonCapabilities['browserstack.key'] }, (error) => {
        if (error) {
          return reject(error);
        };
        resolve();
      });
    });
  },

  afterLaunch: () => {
    return new Promise((resolve, reject) => {
      exports.bs_local.stop(resolve);
    });
  }
};

exports.config.multiCapabilities.forEach(caps => {
  for (const i in exports.config.commonCapabilities) {
    caps[i] = caps[i] || exports.config.commonCapabilities[i];
  }
});
