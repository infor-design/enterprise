const path = require('path');

module.exports = function (config) {
  config.set({
    basePath: '..',
    frameworks: ['jasmine'],
    files: [
      'src/components/*/*.js',
      'test/components/*/*.spec.js'
    ],
    exclude: [
      'node_modules'
    ],
    preprocessors: {
      'src/components/*/*.js': ['webpack'],
      'test/components/*/*.spec.js': ['webpack'],
    },
    webpack: {
      module: {
        rules: [
          {
            test: /\.spec.js$/,
            use: [{
              loader: 'babel-loader',
              options: {
                presets: ['env']
              }
            }],
            exclude: [/node_modules/, /dist/]
          },
          {
            test: /\.js$/,
            use: [{
              loader: 'istanbul-instrumenter-loader',
              options: { esModules: true }
            }],
            exclude: [/node_modules/, /dist/]
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
