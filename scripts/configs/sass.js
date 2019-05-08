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
        'dist/css/theme-soho-high-contrast.css': 'temp/theme-soho-high-contrast.scss',
        'dist/css/theme-uplift-light.css': 'temp/theme-uplift-light.scss'
      }
    },

    custom: {
      options: genericOpts,
      files: {
        'dist/css/theme-soho-light.css': 'temp/theme-soho-light.scss',
        'dist/css/theme-soho-dark.css': 'temp/theme-soho-dark.scss',
        'dist/css/theme-soho-high-contrast.css': 'temp/theme-soho-high-contrast.scss',
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
