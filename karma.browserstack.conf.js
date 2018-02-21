module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'dist/css/light-theme.css',
      'dist/css/light-theme.css.map',
      'dist/js/jquery-3.1.1.js',
      'dist/js/d3.v4.js',
      'dist/js/sohoxi.js',
      'dist/js/cultures/en-US.js',
      'components/**/*.spec.js'
    ],
    exclude: [
      'node_modules'
    ],
    browserStack: {
      username: process.env.BROWSER_STACK_USERNAME,
      accessKey: process.env.BROWSER_STACK_ACCESS_KEY,
      startTunnel: true,
      build: 'unit-tests-browserstack',
      name: 'Unit tests'
    },
    customLaunchers: {
      bs_firefox_mac: {
        base: 'BrowserStack',
        browser: 'Firefox',
        browser_version: '58.0',
        os_version: 'High Sierra',
        os: 'OS X',
        resolution: '1024x768'
      },
      bs_safari_mac: {
        base: 'BrowserStack',
        browser: 'Safari',
        browser_version: '11.0',
        os_version: 'High Sierra',
        os: 'OS X',
        resolution: '1024x768'
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
      'bs_firefox_mac',
      'bs_safari_mac'
    ],
    singleRun: true,
    concurrency: 1
  });
};
