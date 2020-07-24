module.exports = {

  chokidar: {
    sass: {
      files: [
        'src/behaviors/**/*.scss',
        'src/themes/*.scss',
        'src/core/**/*.scss',
        'src/components/**/*.scss'
      ],
      tasks: ['exec:sass:dist'],
      options: {
        livereload: true
      }
    },

    js: {
      files: [
        'src/**/*.js',
        'src/components/locale/cultures/*.*',
        'demoapp/js/site.js'
      ],
      tasks: ['build:js'],
      options: {
        livereload: true,
        spawn: false // For the docs task to work
      }
    },

    configs: {
      files: [
        'gruntfile.js',
        'scripts/*.js',
        'scripts/**/*.js',
      ],
      options: {
        reload: true // NOT supposed to be 'livereload', see https://www.npmjs.com/package/grunt-chokidar#optionsreload
      }
    },

    docs: {
      files: [
        'src/**/*.md',
        '!src/**/*-api.md',
      ],
      options: {
        livereload: true,
        spawn: false
      }
    },

    other: {
      files: [
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
