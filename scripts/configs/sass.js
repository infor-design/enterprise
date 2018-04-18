module.exports = {

  sass: {
    dist: {
      options: {
        sourceMap: true
      },
      files: {
        'dist/css/light-theme.css': 'src/themes/light-theme.scss',
        'dist/css/dark-theme.css': 'src/themes/dark-theme.scss',
        'dist/css/high-contrast-theme.css': 'src/themes/high-contrast-theme.scss'
      }
    },

    demoapp: {
      dist: {
        files: {
          'demoapp/dist/css/demo.css': 'demoapp/src/index.scss'
        }
      }
    }
  }

};
