const genericOpts = {
  sourceMap: true
};

module.exports = {
  sass: {
    dist: {
      options: genericOpts,
      files: {
        'dist/css/theme-classic-light.css': 'temp/theme-classic-light.scss',
        'dist/css/theme-classic-dark.css': 'temp/theme-classic-dark.scss',
        'dist/css/theme-classic-contrast.css': 'temp/theme-classic-contrast.scss',
        'dist/css/theme-new-light.css': 'temp/theme-new-light.scss',
        'dist/css/theme-new-dark.css': 'temp/theme-new-dark.scss',
        'dist/css/theme-new-contrast.css': 'temp/theme-new-contrast.scss',
      }
    },

    custom: {
      options: genericOpts,
      files: {
        'dist/css/theme-classic-light.css': 'temp/theme-classic-light.scss',
        'dist/css/theme-classic-dark.css': 'temp/theme-classic-dark.scss',
        'dist/css/theme-classic-contrast.css': 'temp/theme-classic-contrast.scss',
        'dist/css/theme-new-light.css': 'temp/theme-new-light.scss',
        'dist/css/theme-new-dark.css': 'temp/theme-new-dark.scss',
        'dist/css/theme-new-contrast.css': 'temp/theme-new-contrast.scss',
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
