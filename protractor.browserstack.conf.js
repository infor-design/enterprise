/* eslint-disable */
const { SpecReporter } = require('jasmine-spec-reporter');
const browserstack = require('browserstack-local');
const protractorImageComparison = require('protractor-image-comparison');

const getSpecs = (listSpec) => {
  if (listSpec) {
    return listSpec.split(',');
  }

  return ['components/**/*.functional-spec.js'];
};

exports.config = {
  allScriptsTimeout: 120000,
  specs: getSpecs(process.env.PROTRACTOR_SPECS),
  seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
  SELENIUM_PROMISE_MANAGER: false,
  commonCapabilities: {
    'browserstack.user': process.env.BROWSER_STACK_USERNAME,
    'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY,
    'browserstack.debug': true,
    'browserstack.local': true,
    build: 'Protractor',
    name: 'Functional tests'
  },
  multiCapabilities: [
    {
      browserName: 'Chrome',
      browser_version: '64'
    },
    {
      browserName: 'Firefox',
      browser_version: '58'
    },
    {
      os: 'OS X',
      os_version: 'El Capitan',
      browserName: 'Safari',
      browser_version: '9.1'
    },
    {
      browserName: 'Edge'
    },
    {
      browserName: 'IE',
      browser_version: '11'
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
    browser.ignoreSynchronization = true;

    browser.protractorImageComparison = new protractorImageComparison({
      baselineFolder: './baseline/',
      screenshotPath: './.tmp/',
      autoSaveBaseline: true,
      debug: false
    });

    jasmine.getEnv().addReporter(new SpecReporter({
      spec: { displayStacktrace: true }
    }));

    return browser.getProcessedConfig().then((cap) => {
      browser.browserName = cap.capabilities.browserName;
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
