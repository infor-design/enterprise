const path = require('path');

module.exports = function (config) {
  config.set({
    basePath: '..',
    frameworks: ['jasmine'],
    files: [
      'dist/js/jquery-3.3.1.js',
      'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
      'src/components/locale/locale.js',
      'test/components/locale/locale.spec.js'
    ],
    exclude: [
      'node_modules'
    ],
    preprocessors: {
      'src/components/locale/locale.js': ['webpack'],
      'test/components/locale/locale.spec.js': ['webpack'],
    },
    webpack: {
      module: {
        rules: [
          {
            test: /\locale.spec.js$/,
            use: [{
              loader: 'babel-loader',
              options: {
                presets: ['env']
              }
            }],
            exclude: /node_modules/
          },
          {
            test: /\locale.js$/,
            use: [{
              loader: 'istanbul-instrumenter-loader',
              options: { esModules: true }
            }],
            exclude: /node_modules/
          }
        ]
      }
    },
    webpackMiddleware: {
      stats: 'errors-only'
    },
    reporters: ['mocha', 'coverage-istanbul'],
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcov', 'text-summary' ],
      fixWebpackSourcePaths: true
    },
    port: 9876,
    colors: true,
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox']
      }
    },
    singleRun: false
  });
};
