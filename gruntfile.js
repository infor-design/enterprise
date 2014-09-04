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
        banner: '/*!\n Soho 2.0 Controls v<%= pkg.version %> \n Date: <%= grunt.template.today("dd-mm-yyyy MM:hh:ss") %> \n Revision: ' + process.env.SVN_REVISION + ' \n */ \n '
      },
      basic: {
        files: {

          'dist/js/<%= pkg.name %>.js': ['js/editor.js', 'js/dropdown.js', 'js/draggable.js', 'js/popupmenu.js', 'js/mask.js', 'js/message.js', 'js/modal.js', 'js/rating.js', 'js/tabs.js', 'js/tooltip.js','js/tree.js', 'js/slider.js'],
          'dist/js/initialize.js': ['js/initialize.js']
        }
      }
    },

    concurrent: {
      selenium: ['shell:runSeleniumServer']
    },

    uglify: {
      dist: {
        options: {
          banner: '/*!\n Soho 2.0 Controls v<%= pkg.version %> \n Date: <%= grunt.template.today("dd-mm-yyyy MM:hh:ss") %> \n Revision: ' + process.env.SVN_REVISION + ' \n */ \n ',
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
    },

    shell: {
      runSeleniumServer: {
        command: 'start-selenium',
        options: {}
      },
      // TODO: flesh this out to be pattern-based
      runMochaSeleniumTests: {
        command: 'mocha <%= shell.runMochaSeleniumTests.options.testFile %> -t 20000',
        options: {
          testFile: 'test/spec/dropdown/dropdown-selenium-tests.js'
        }
      }
    }
  });

  // load all grunt tasks from 'node_modules' matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('test', ['jshint','concurrent:selenium', 'shell:runMochaSeleniumTests']);
  grunt.registerTask('default', ['jshint', 'sass', 'concat', 'uglify', 'copy:main']);
};
