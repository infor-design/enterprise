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
      }
    },
  }

};
