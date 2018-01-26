module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'dist/css/light-theme.css',
      'dist/js/jquery-3.1.1.js',
      'dist/js/sohoxi.js',
      'components/**/*.spec.js'
    ],
    exclude: [
      'node_modules'
    ],
    browserStack: {
      username: process.env.BROWSER_STACK_USERNAME,
      accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
      startTunnel: true
    },
    customLaunchers: {
      bs_firefox_mac: {
        base: 'BrowserStack',
        browser: 'firefox',
        browser_version: '56.0',
        os: 'OS X',
        os_version: 'Sierra'
      },
      bs_iphone8: {
        base: 'BrowserStack',
        device: 'iPhone 8',
        os: 'ios',
        os_version: '11.0'
      }
    },
    preprocessors: {
      'components/**/*.spec.js': ['webpack'],
      'dist/js/sohoxi.js': ['coverage']
    },
    webpack: {
      module: {
        rules: [{
          test: /\.html$/,
          use: [{
            loader: 'html-loader'
          }],
        }]
      }
    },
    webpackMiddleware: {
      stats: 'errors-only'
    },
    reporters: ['mocha', 'coverage', 'BrowserStack'],
    coverageReporter: {
      includeAllSources: true,
      dir: 'coverage/',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text-summary' }
      ]
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [
      'ChromeHeadless',
      'Chrome',
      'bs_firefox_mac',
      'bs_iphone8'
    ],
    singleRun: false,
    concurrency: Infinity
  });
};
