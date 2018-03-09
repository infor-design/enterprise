const { SpecReporter } = require('jasmine-spec-reporter');
const protractorImageComparison = require('protractor-image-comparison');

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    '**/functional/*.functional-spec.js'
  ],
  capabilities: {
    browserName: 'chrome'
  },
  directConnect: false,
  baseUrl: 'http://localhost:4000/',
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: () => {}
  },
  onPrepare: () => {
    browser.protractorImageComparison = new protractorImageComparison({
      baselineFolder: './baseline/',
      screenshotPath: './.tmp/',
      autoSaveBaseline: true,
      debug: true
    });
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: { displayStacktrace: true }
    }));
  }
};
