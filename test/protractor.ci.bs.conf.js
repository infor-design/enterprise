/* eslint-disable */
const basePath = __dirname;
const { SpecReporter } = require('jasmine-spec-reporter');
const protractorImageComparison = require('protractor-image-comparison');

const getSpecs = (listSpec) => {
  if (listSpec) {
    return listSpec.split(',');
  }

  return ['components/**/*.e2e-spec.js', 'kitchen-sink.e2e-spec.js'];
};

const theme = process.env.ENTERPRISE_THEME || 'light'

exports.config = {
  params: {
    theme
  },
  allScriptsTimeout: 12000,
  logLevel: 'INFO',
  specs: getSpecs(process.env.PROTRACTOR_SPECS),
  seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
  SELENIUM_PROMISE_MANAGER: false,
  baseUrl: 'http://master-enterprise.demo.design.infor.com',
  jasmineNodeOpt: {
    defaultTimeoutInterval: 10000,
    showColors: true,
    random: false
  },
  commonCapabilities: {
    'browserstack.user': process.env.BROWSERSTACK_USERNAME,
    'browserstack.key': process.env.BROWSERSTACK_ACCESS_KEY,
    'browserstack.debug': true,
    'browserstack.video' : true,
    'browserstack.local': false,
    'browserstack.networkLogs' : false,
    build: `${theme} theme: ci:bs e2e`,
    name: `${theme} theme ci:bs e2e tests`,
    project: 'ids-enterprise-e2e-ci'
  },
  multiCapabilities: [
    {
      browserName: 'Chrome',
      browser_version: '66.0',
      resolution: '1280x800',
      os_version: '10',
      os: 'Windows'
    }
  ],
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
      spec: { displayStacktrace: true }
    }));
  }
};

exports.config.multiCapabilities.forEach((caps) => {
  for (const i in exports.config.commonCapabilities) {
    caps[i] = caps[i] || exports.config.commonCapabilities[i];
  }
});
