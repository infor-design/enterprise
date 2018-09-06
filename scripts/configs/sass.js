const sass = require('node-sass');

module.exports = {
  sass: {
    dist: {
      options: {
        implementation: sass,
        sourceMap: true
      },
      files: {
        'app/dist/css/demo.css': 'app/src/index.scss',
        'dist/css/light-theme.css': 'src/themes/light-theme.scss',
        'dist/css/dark-theme.css': 'src/themes/dark-theme.scss',
        'dist/css/high-contrast-theme.css': 'src/themes/high-contrast-theme.scss',
        'dist/css/uplift-theme.css': 'src/themes/uplift-theme.scss'
      }
    },

    app: {
      options: {
        implementation: sass,
        sourceMap: true
      },
      files: {
        'app/dist/css/docs.css': 'app/src/docs.scss',
        'app/dist/css/demo.css': 'app/src/index.scss',
      }
    }
  }
};
