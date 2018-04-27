module.exports = function (config) {
  config.set({
    basePath: '..',
    frameworks: ['jasmine'],
    files: [
      'dist/js/jquery-3.3.1.js',
      'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
      'test/components/locale/locale.spec.js'
    ],
    exclude: [
      'node_modules'
    ],
    preprocessors: {
      'src/components/locale/locale.js': ['webpack', 'sourcemap'],
      'test/components/locale/locale.spec.js': ['webpack', 'sourcemap', 'coverage'],
    },
    webpack: {
      module: {
        rules: [
          {
            test: /\.html$/,
            use: [{
              loader: 'html-loader'
            }],
          },
          {
            test: /\.js$/,
            use: [{
              loader: 'babel-loader',
              options: {
                presets: ['env']
              }
            }],
            exclude: /node_modules/
          }
        ]
      }
    },
    webpackMiddleware: {
      stats: 'errors-only'
    },
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' },
        { type: 'json' }
      ]
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
