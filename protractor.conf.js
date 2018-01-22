const { SpecReporter } = require('jasmine-spec-reporter');

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

  // ---- To use remote browsers via BrowserStack ---------------------------
  /**
   * If browserstackUser and browserstackKey are specified, seleniumServerJar
   * will be ignored. The tests will be run remotely using BrowserStack.
   */

  //browserstackUser?: string;

  /**
   * If browserstackUser and browserstackKey are specified, seleniumServerJar
   * will be ignored. The tests will be run remotely using BrowserStack.
   */

  //browserstackKey?: string;
};
