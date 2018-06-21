module.exports = function (config) {
  config.set({
    basePath: '..',
    frameworks: ['jasmine'],
    files: [
      'dist/css/light-theme.css',
      'dist/js/jquery-3.3.1.js',
      'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
      'dist/js/d3.v4.js',
      'dist/js/sohoxi.js',
      'dist/js/cultures/en-US.js',
      'test/components/**/*.func-spec.js'
    ],
    exclude: [
      'node_modules'
    ],
    preprocessors: {
      '**/components/*/*.js': ['webpack', 'sourcemap'],
    },
    webpack: {
      optimization: {
        minimize: false
      },
      devtool: 'sourcemap',
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
      logLevel: 'error'
    },
    reporters: ['mocha', 'coverage'],
    // coverageReporter: {
    //   dir: 'coverage',
    //   reporters: [
    //     { type: 'lcov', subdir: '.' },
    //     { type: 'text-summary' },
    //     { type: 'json' }
    //   ]
    // },
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
