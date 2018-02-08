const { SpecReporter } = require('jasmine-spec-reporter');
const protractorImageComparison = require('protractor-image-comparison');

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    '**/e2e/*.e2e-spec.js'
  ],
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless', '--disable-gpu', '--window-size=360,640']
    }
  },
  directConnect: true,
  baseUrl: 'http://localhost:4000/',
  framework: 'jasmine2',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  onPrepare: function() {
    browser.ignoreSynchronization = true;
    jasmine.getEnv().addReporter(new SpecReporter({
      spec: { displayStacktrace: true }
    }));
  }
};
