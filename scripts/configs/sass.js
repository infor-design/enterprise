module.exports = {
  sass: {
    dist: {
      options: {
        sourceMap: true
      },
      files: {
        'app/dist/css/demo.css': 'app/src/index.scss',
        'dist/css/light-theme.css': 'src/themes/light-theme.scss',
        'dist/css/dark-theme.css': 'src/themes/dark-theme.scss',
        'dist/css/high-contrast-theme.css': 'src/themes/high-contrast-theme.scss'
      }
    },

    app: {
      options: {
        sourceMap: true
      },
      files: {
        'app/dist/css/docs.css': 'app/src/docs.scss',
        'app/dist/css/demo.css': 'app/src/index.scss',
      }
    }
  }
};
