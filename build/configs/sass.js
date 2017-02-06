module.exports = {

  sass: {
    options: {
      sourceMap: true
    },
    dist: {
      files: {
        'dist/css/demo.css'                : 'sass/demo.scss',
        'dist/css/light-theme.css'         : 'sass/light-theme.scss',
        'dist/css/dark-theme.css'          : 'sass/dark-theme.scss',
        'dist/css/high-contrast-theme.css' : 'sass/high-contrast-theme.scss',
        'dist/css/css-only.css'            : 'sass/css-only.scss',
        'dist/css/site.css'                : 'sass/site.scss'
      }
    }
  }

};
