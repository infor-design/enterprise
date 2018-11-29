const sass = require('node-sass');

const genericOpts = {
  implementation: sass,
  sourceMap: true
};

module.exports = {
  sass: {
    dist: {
      options: genericOpts,
      files: {
        'dist/css/light-theme.css': 'src/themes/light-theme.scss',
        'dist/css/dark-theme.css': 'src/themes/dark-theme.scss',
        'dist/css/high-contrast-theme.css': 'src/themes/high-contrast-theme.scss',
        'dist/css/uplift-alpha-theme.css': 'src/themes/uplift-alpha-theme.scss'
      }
    },

    custom: {
      options: genericOpts,
      files: {
        'dist/css/light-theme.css': 'temp/light-theme.scss',
        'dist/css/dark-theme.css': 'temp/dark-theme.scss',
        'dist/css/high-contrast-theme.css': 'temp/high-contrast-theme.scss',
        'dist/css/uplift-alpha-theme.css': 'temp/uplift-alpha-theme.scss'
      }
    },

    app: {
      options: genericOpts,
      files: {
        'app/dist/css/docs.css': 'app/src/docs.scss',
        'app/dist/css/demo.css': 'app/src/index.scss',
      }
    }
  }
};
