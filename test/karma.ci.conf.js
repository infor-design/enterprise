const getSpecs = (listSpec) => {
  if (listSpec) {
    return listSpec.split(',');
  }

  return ['../test/components/**/*.spec.js'];
};

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      '../dist/css/light-theme.css',
      '../dist/js/jquery-3.3.1.js',
      '../node_modules/jasmine-jquery/lib/jasmine-jquery.js',
      '../dist/js/d3.v4.js',
      '../dist/js/sohoxi.js',
      '../dist/js/cultures/en-US.js'
    ].concat(getSpecs(process.env.KARMA_SPECS)),
    exclude: [
      '../node_modules'
    ],
    preprocessors: {
      '../test/components/**/*.spec.js': ['webpack', 'sourcemap'],
      '../dist/js/sohoxi.js': ['coverage']
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
            }]
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
    autoWatch: false,
    singleRun: true,
    concurrency: Infinity,
  });
};
