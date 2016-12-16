module.exports = function(grunt) {
  grunt.file.defaultEncoding = 'utf-8';
  grunt.file.preserveBOM = true;

  const dependencyBuilder = require('./build/dependencybuilder.js'),
    strBanner = require('./build/strbanner.js'),
    controls = require('./build/controls.js');

  let selectedControls = dependencyBuilder(grunt),
    bannerText = `/**\n* Soho XI Controls v<%= pkg.version %>\n* Date: <%= grunt.template.today("dd/mm/yyyy h:MM:ss TT") %>\n* Revision: <%= meta.revision %>\n*/\n`;

  if (selectedControls) {
    let bannerList = strBanner(selectedControls);
    bannerText = `/**\n* Soho XI Controls v<%= pkg.version %>\n* ${bannerList}\n* Date: <%= grunt.template.today("dd/mm/yyyy h:MM:ss TT") %>\n* Revision: <%= meta.revision %>\n*/ \n`;
  } else {
    selectedControls = controls;
  }

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    banner: bannerText,
    amdHeader: '(function(factory) {\n\n  if (typeof define === \'function\' && define.amd) {\n    // AMD. Register as an anonymous module\n    define([\'jquery\'], factory);\n  } else if (typeof exports === \'object\') {\n    // Node/CommonJS\n    module.exports = factory(require(\'jquery\'));\n} else {\n    // Browser globals \n    factory(jQuery);\n  }\n\n}(function($) {\n\n',

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'dist/css/demo.css'                : 'sass/demo.scss',
          'dist/css/light-theme.css'         : 'sass/light-theme.scss',
          'dist/css/dark-theme.css'          : 'sass/dark-theme.scss',
          'dist/css/high-contrast-theme.css' : 'sass/high-contrast-theme.scss',
          'dist/css/css-only.css'            : 'sass/css-only.scss',
          'dist/css/site.css'                : 'sass/site.scss'
        }
      }
    },

    watch: {
      source: {
        files: ['sass/**/*.scss', 'svg/*.svg', 'views/docs/**.html', 'views/**.html', 'views/includes/**.html', 'views/controls/**.html', 'js/*/*.js', 'js/*.js', 'js/cultures/*.*'],
        tasks: ['sohoxi-watch'],
        options: {
          livereload: true
        }
      }
    },

    jshint: {
      files: ['gruntfile.js', 'app.js', 'js/*.js', 'build/**/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    concat: {
      options: {
        separator: '',
        banner: '<%= banner %>'+'<%= amdHeader %>',
        footer: '\n}));\n//# sourceURL=<%= pkg.shortName %>.js'
      },
      basic: {
        files: {
          'dist/js/<%= pkg.shortName %>.js': selectedControls
        }
      },

      missingFiles: {
        src: selectedControls,
        dest: 'temp/missing-files.js',
        filter: function (filepath) {
          if (!grunt.file.exists(filepath)) {
            grunt.fail.warn('Could not find: ' + filepath);
          } else {
            return true;
          }
        },
        nonull: true
      }

    },

    uglify: {
      dist: {
        options: {
          banner: '<%= banner %>',
          sourceMap: true,
          sourceMapName: 'dist/js/sohoxi.map',
          separator: ';'
        },
        files: {
          'dist/js/sohoxi.min.js': ['dist/js/sohoxi.js']
        }
      }
    },

    copy: {
      main: {
        files: [
          {expand: true, flatten: true, src: ['dist/js/sohoxi.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['dist/js/sohoxi.min.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/sohoxi-angular.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/sohoxi-angular.js'], dest: 'dist/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/sohoxi-knockout.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/sohoxi-knockout.js'], dest: 'dist/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/*.js'], dest: 'dist/js/all/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['dist/css/*'], dest: 'public/stylesheets/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/demo/*.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-3*.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-3*.min.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-3*.map'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-3*.js'], dest: 'dist/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-3*.min.js'], dest: 'dist/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-3*.map'], dest: 'dist/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/d3.*'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-2*.js'], dest: 'dist/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-2*.min.js'], dest: 'dist/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-2*.map'], dest: 'dist/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/d3.*'], dest: 'dist/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/cultures/*.*'], dest: 'public/js/cultures/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/cultures/*.*'], dest: 'dist/js/cultures/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['views/controls/svg*.html'], dest: 'dist/svg/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['views/controls/svg*.html'], dest: 'public/svg/', filter: 'isFile'}
        ]
      },
      amd: {
        files: [
          {expand: true, flatten: true, src: ['js/*.*'], dest: 'temp/amd/', filter: 'isFile'}
        ]
      }
    },

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
          'dist/css/css-only.min.css': ['dist/css/css-only.css'],
        }
      }
    },

    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner: '<%= banner %>',
          linebreak: true
        },

        files: {
          src: [
            'dist/css/508-theme.css',
            'dist/css/508-theme.min.css',
            'dist/css/dark-theme.css',
            'dist/css/dark-theme.min.css',
            'dist/css/light-theme.css',
            'dist/css/light-theme.min.css',
            'dist/css/css-only.css',
            'dist/css/css-only.min.css',
            'dist/js/all/*.js'
          ]
        }
      }
    },

    // Git Revision
    revision: {
      options: {
        property: 'meta.revision',
        ref: 'HEAD',
        short: false
      }
    },

    meta: {
      revision: undefined
    },

    strip_code: { // jshint ignore:line
      options: {
        start_comment: 'start-amd-strip-block', // jshint ignore:line
        end_comment: 'end-amd-strip-block' // jshint ignore:line
      },
      src: {
        src: 'temp/amd/*.js'
      }
    },

    clean: {
      amd: ['temp'],
      dist: ['dist/js/*', 'dist/svg/*', 'dist/css/*'],
      public: ['public/js/*','public/svg/*','public/stylesheets/*']
    },

    compress: {
      main: {
        options: {
          archive: 'dist/all.zip'
        },

        files: [
          {src: ['dist/**'], dest: 'dist/'}
        ]
      }
    },

    md2html: {
      changelog: {
        options: {
          // Task-specific options go here.
        },
        files: [{
          src: ['CHANGELOG.md'],
          dest: 'views/docs/changelog-contents.html'
        }]
      }
    },

    documentation: {
      default: {
        files: [{
          src: ['js/*.js']
        }],
        options: {
          name: 'SoHo Documentation',
          destination: 'documentation',
          version: '4.2.x',
          output: 'html',
          github: 'true',
          external: "!(soho-*)"
        }
      },
    }

  });

  // load all grunt tasks from 'node_modules' matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [
    'clean:dist',
    'clean:public',
    'revision',
    'jshint',
    'sass',
    'copy:amd',
    'strip_code',
    'concat',
    'clean:amd',
    'uglify',
    'cssmin',
    'copy:main',
    'usebanner',
    'compress',
    'md2html'
  ]);

  grunt.registerTask('js', [
    'clean:dist',
    'clean:public',
    'revision',
    'jshint',
    'copy:amd',
    'strip_code',
    'concat',
    'clean:amd',
    'uglify',
    'copy:main',
    'usebanner'
  ]);

  grunt.registerTask('js', ['documentation']);


  // Don't do any uglify/minify/jshint while the Dev Watch is running.
  grunt.registerTask('sohoxi-watch', [
    'revision', 'sass', 'copy:amd', 'strip_code','concat', 'clean:amd', 'copy:main', 'usebanner'
  ]);
};
