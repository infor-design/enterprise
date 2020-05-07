const specs = require('./helpers/detect-custom-spec-list')('functional', process.env.PROTRACTOR_SPECS);

// Preprend `test/` to the spec list results
specs.forEach((spec, i) => {
  specs[i] = `test/${spec}`;
});

const files = [
  'dist/css/light-theme.css',
  'dist/js/jquery-3.4.1.js',
  'node_modules/jasmine-jquery/lib/jasmine-jquery.js',
  'dist/js/d3.v5.js',
  'dist/js/sohoxi.js',
  'dist/js/cultures/en-US.js',
  'dist/js/cultures/ar-EG.js',
  'dist/js/cultures/es-ES.js',
  'dist/js/cultures/fr-FR.js',
  'dist/js/cultures/no-NO.js',
  'dist/js/cultures/pt-PT.js',
  'app/www/test/js/sv-SE.f0r73571n6purp0537051mul473h45h.js'
].concat(specs);

module.exports = function (config) {
  config.set({
    basePath: '..',
    frameworks: ['jasmine'],
    files,
    exclude: [
      'node_modules'
    ],
    preprocessors: {
      '**/behaviors/*/*.js': ['webpack', 'sourcemap'],
      '**/components/*/*.js': ['webpack', 'sourcemap'],
    },
    proxies: {
      '/images/': 'app/www/images/'
    },
    webpack: {
      optimization: {
        minimize: false
      },
      mode: 'development',
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
                presets: ['@babel/preset-env'],
                plugins: ['transform-optional-chaining']
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
    reporters: ['mocha'],
    mochaReporter: {
      ignoreSkipped: true,
    },
    // reporters: ['mocha', 'coverage'],
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
