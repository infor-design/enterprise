module.exports = {
  usebanner: {
    dist: {
      options: {
        position: 'top',
        banner: '<%= banner %>',
        linebreak: true
      },

      files: {
        src: [
          'dist/css/light-theme.min.css',
          'dist/css/dark-theme.min.css',
          'dist/css/high-contrast-theme.min.css',
          // 'dist/css/uplift-theme.min.css',
          'dist/js/sohoxi.min.js'
        ]
      }
    }
  }
};
