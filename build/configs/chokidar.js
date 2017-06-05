module.exports = {

  chokidar: {
    source: {
      files: ['sass/**/*.scss', 'svg/*.svg', 'views/docs/**.html', 'views/**.html', 'views/includes/**.html', 'views/controls/**.html', 'js/*/*.js', 'js/*.js', 'js/cultures/*.*'],
      tasks: ['sohoxi-watch'],
      options: {
        livereload: true
      }
    }
  }

};
