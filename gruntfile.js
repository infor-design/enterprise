module.exports = function(grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dist: {
        files: {
          'public/stylesheets/grey-theme.css' : 'sass/grey-theme.scss',
          'public/stylesheets/white-theme.css' : 'sass/white-theme.scss',
          'public/stylesheets/dark-theme.css' : 'sass/dark-theme.scss',
          'public/stylesheets/508-theme.css' : 'sass/508-theme.scss',
          'public/stylesheets/demo.css' : 'sass/demo.scss',
          'public/stylesheets/highlight.css' : 'sass/highlight.scss'
        }
      }
    },

    watch: {
      source: {
        files: ['sass/**/*.scss', 'views/**.ejs', 'views/controls/**.ejs', 'js/*.js'],
        tasks: ['sass', 'concat', 'uglify', 'copy'],
        options: {
          livereload: true
        }
      }
    },

    jshint: {
      files: ['gruntfile.js', 'app.js', 'js/*.js'],
      options: {
        jshintrc: '.jshintrc',
      }
    },

    concat: {
      options: {
        separator: '',
        banner: '/*!\n Gramercy Controls v<%= pkg.version %> \n Date: <%= grunt.template.today("dd-mm-yyyy MM:hh:ss") %> \n Revision: ' + process.env.SVN_REVISION + ' \n */ \n '
      },
      basic: {
        files: {
          'dist/js/<%= pkg.name %>.js': ['js/select.js', 'js/tabs.js'],
          'dist/js/initialize.js': ['js/initialize.js']
        }
      }
    },

    uglify: {
      dist: {
        options: {
          banner: '/*!\n Gramercy Controls v<%= pkg.version %> \n Date: <%= grunt.template.today("dd-mm-yyyy MM:hh:ss") %> \n Revision: ' + process.env.SVN_REVISION + ' \n */ \n ',
          sourceMap: true,
          sourceMapName: 'dist/js/gramercy.map',
          separator: ';'
        },
        files: {
          'dist/js/gramercy.min.js': ['dist/js/gramercy.js']
        }
      }
    },

    copy: {
      main: {
        files: [
          {expand: true, flatten: true, src: ['dist/js/gramercy.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['public/stylesheets/*-theme.css'], dest: 'dist/css/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['dist/js/initialize.js'], dest: 'public/js/', filter: 'isFile'}
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['jshint', 'sass', 'concat', 'uglify', 'copy', 'watch']);
};
