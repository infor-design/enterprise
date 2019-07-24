module.exports = {

  // Minify css
  cssmin: {
    options: {
      roundingPrecision: -1
    },
    dist: {
      files: {
        'dist/css/theme-soho-contrast.min.css': ['dist/css/theme-soho-contrast.css'],
        'dist/css/theme-soho-dark.min.css': ['dist/css/theme-soho-dark.css'],
        'dist/css/theme-soho-light.min.css': ['dist/css/theme-soho-light.css'],
        'dist/css/theme-uplift-light.min.css': ['dist/css/theme-uplift-light.css'],
        'dist/css/theme-uplift-dark.min.css': ['dist/css/theme-uplift-dark.css'],
        'dist/css/theme-uplift-contrast.min.css': ['dist/css/theme-uplift-contrast.css'],
        'dist/css/high-contrast-theme.min.css': ['dist/css/high-contrast-theme.css'],
        'dist/css/light-theme.min.css': ['dist/css/light-theme.css'],
        'dist/css/dark-theme.min.css': ['dist/css/dark-theme.css'],
      }
    },
  }

};
