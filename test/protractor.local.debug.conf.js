/* eslint-disable */
const basePath = __dirname;
const { SpecReporter } = require('jasmine-spec-reporter');
const protractorImageComparison = require('protractor-image-comparison');
const customSpecs = require('./helpers/detect-custom-spec-list')('e2e');

const getSpecs = (listSpec) => {
  if (listSpec) {
    return listSpec.split(',');
  }

  if (customSpecs) {
    return customSpecs;
  }

  return ['behaviors/**/*.e2e-spec.js', 'components/**/*.e2e-spec.js', 'kitchen-sink.e2e-spec.js'];
};

exports.config = {
  params: {
    theme:  process.env.ENTERPRISE_THEME || 'light'
  },
  allScriptsTimeout: 120000,
  logLevel: 'DEBUG',
  specs: getSpecs(process.env.PROTRACTOR_SPECS),
  SELENIUM_PROMISE_MANAGER: false,
  capabilities: {
    browserName: 'chrome' || 'firefox',
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
    browser.protractorImageComparison = new protractorImageComparison({
      baselineFolder: `${basePath}/baseline`,
      screenshotPath: `${basePath}/.tmp/`,
      autoSaveBaseline: false,
      ignoreAntialiasing: true,
      debug: false
    });

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
