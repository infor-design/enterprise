const genericOpts = {
  sourceMap: true
};

module.exports = {
  sass: {
    dist: {
      options: genericOpts,
      files: {
        'dist/css/light-theme.css': 'temp/light-theme.scss',
        'dist/css/dark-theme.css': 'temp/dark-theme.scss',
        'dist/css/high-contrast-theme.css': 'temp/high-contrast-theme.scss',
        'dist/css/theme-uplift-light.css': 'temp/theme-uplift-light.scss'
      }
    },

    custom: {
      options: genericOpts,
      files: {
        'dist/css/light-theme.css': 'temp/light-theme.scss',
        'dist/css/dark-theme.css': 'temp/dark-theme.scss',
        'dist/css/high-contrast-theme.css': 'temp/high-contrast-theme.scss',
        'dist/css/theme-uplift-light.css': 'temp/theme-uplift-light.scss'
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
