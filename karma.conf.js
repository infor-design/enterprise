module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'dist/css/light-theme.css',
      'dist/js/jquery-3.1.1.js',
      'dist/js/d3.v4.js',
      'dist/js/sohoxi.js',
      'dist/js/cultures/en-US.js',
      'components/**/*.spec.js',
    ],
    exclude: [
      'node_modules'
    ],
    preprocessors: {
      'components/**/*.spec.js': ['webpack', 'sourcemap'],
      'dist/css/light-theme.css.map': ['webpack', 'sourcemap'],
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
    reporters: ['mocha', 'coverage'],
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
      'Chrome'
    ],
    singleRun: false,
    concurrency: Infinity
  });
};
