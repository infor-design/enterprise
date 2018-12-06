module.exports = {

  // Minify css
  cssmin: {
    options: {
      roundingPrecision: -1
    },
    dist: {
      files: {
        'dist/css/high-contrast-theme.min.css': ['dist/css/high-contrast-theme.css'],
        'dist/css/dark-theme.min.css': ['dist/css/dark-theme.css'],
        'dist/css/light-theme.min.css': ['dist/css/light-theme.css'],
        'dist/css/uplift-alpha-theme.min.css': ['dist/css/uplift-alpha-theme.css'],
      }
    },
  }

};
