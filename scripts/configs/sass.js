const genericOpts = {
  sourceMap: true
};

module.exports = {
  sass: {
    dist: {
      options: genericOpts,
      files: {
        'dist/css/theme-soho-light.css': 'temp/theme-soho-light.scss',
        'dist/css/theme-soho-dark.css': 'temp/theme-soho-dark.scss',
        'dist/css/theme-soho-contrast.css': 'temp/theme-soho-contrast.scss',
        'dist/css/theme-uplift-light.css': 'temp/theme-uplift-light.scss',
        'dist/css/theme-uplift-dark.css': 'temp/theme-uplift-dark.scss',
        'dist/css/theme-uplift-contrast.css': 'temp/theme-uplift-contrast.scss',
      }
    },

    custom: {
      options: genericOpts,
      files: {
        'dist/css/theme-soho-light.css': 'temp/theme-soho-light.scss',
        'dist/css/theme-soho-dark.css': 'temp/theme-soho-dark.scss',
        'dist/css/theme-soho-contrast.css': 'temp/theme-soho-contrast.scss',
        'dist/css/theme-uplift-light.css': 'temp/theme-uplift-light.scss',
        'dist/css/theme-uplift-dark.css': 'temp/theme-uplift-dark.scss',
        'dist/css/theme-uplift-contrast.css': 'temp/theme-uplift-contrast.scss',
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
