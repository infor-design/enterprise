module.exports = {

  chokidar: {
    sass: {
      files: [
        'components/**/*.scss',
        'sass/**/*.scss'
      ],
      tasks: ['build:sass'],
      options: {
        livereload: true
      }
    },

    js: {
      files: [
        'components/**/*.js',
        'components/locale/cultures/*.*',
        'demoapp/js/site.js'
      ],
      tasks: ['build:js'],
      options: {
        livereload: true,
        nospawn: true // For the docs task to work
      }
    },

    configs: {
      files: [
        'gruntfile.js',
        'build/*.js',
        'build/**/*.js',
      ],
      options: {
        reload: true // NOT supposed to be 'livereload', see https://www.npmjs.com/package/grunt-chokidar#optionsreload
      }
    },

    other: {
      files: [
        'components/**/*.md',
        '!components/**/*-api.md',
        'svg/*.svg',
        'views/docs/**.html',
        'views/**.html',
        'views/includes/**.html',
        'views/controls/**.html'
      ],
      options: {
        livereload: true
      }
    }
  }

};
