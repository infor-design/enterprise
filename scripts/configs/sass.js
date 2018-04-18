module.exports = {

  sass: {
    options: {
      sourceMap: true
    },
    dist: {
      files: {
        'demoapp/dist/css/demo.css': 'demoapp/src/index.scss',
        'dist/css/light-theme.css': 'src/light-theme.scss',
        'dist/css/dark-theme.css': 'src/dark-theme.scss',
        'dist/css/high-contrast-theme.css': 'src/high-contrast-theme.scss'
      }
    }
  }

};
