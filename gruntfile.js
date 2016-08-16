module.exports = function(grunt) {

  grunt.file.defaultEncoding = 'utf-8';
  grunt.file.preserveBOM = true;

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    banner: '/**\n* Soho XI Controls v<%= pkg.version %> \n* Date: <%= grunt.template.today("dd/mm/yyyy h:MM:ss TT") %> \n* Revision: <%= meta.revision %> \n */ \n',
    amdHeader: '(function(factory) {\n\n  if (typeof define === \'function\' && define.amd) {\n    // AMD. Register as an anonymous module\n    define([\'jquery\'], factory);\n  } else if (typeof exports === \'object\') {\n    // Node/CommonJS\n    module.exports = factory(require(\'jquery\'));\n} else {\n    // Browser globals \n    factory(jQuery);\n  }\n\n}(function($) {\n\n',

    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'dist/css/demo.css'       : 'sass/demo.scss',
          'dist/css/grey-theme.css' : 'sass/grey-theme.scss',
          'dist/css/dark-theme.css' : 'sass/dark-theme.scss',
          'dist/css/high-contrast-theme.css'  : 'sass/high-contrast-theme.scss',
          'dist/css/css-only.css'   : 'sass/css-only.scss',
          'dist/css/site.css'       : 'sass/site.scss'
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
      files: ['gruntfile.js', 'app.js', 'js/*.js'],
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
          'dist/js/<%= pkg.shortName %>.js': [
            'temp/amd/initialize.js',
            'temp/amd/base.js',
            'temp/amd/utils.js',
            'temp/amd/animations.js',
            'temp/amd/locale.js',
            'temp/amd/listfilter.js',
            'temp/amd/about.js',
            'temp/amd/accordion.js',
            'temp/amd/applicationmenu.js',
            'temp/amd/autocomplete.js',
            'temp/amd/busyindicator.js',
            'temp/amd/button.js',
            'temp/amd/chart.js',
            'temp/amd/colorpicker.js',
            'temp/amd/contextualactionpanel.js',
            'temp/amd/datepicker.js',
            'temp/amd/datagrid.js',
            'temp/amd/dropdown.js',
            'temp/amd/drag.js',
            'temp/amd/editor.js',
            'temp/amd/expandablearea.js',
            'temp/amd/flyingfocus.js',
            'temp/amd/form.js',
            'temp/amd/fileupload.js',
            'temp/amd/fileuploadadvanced.js',
            'temp/amd/header.js',
            'temp/amd/hierarchy.js',
            'temp/amd/highlight.js',
            'temp/amd/homepage.js',
            'temp/amd/icon.js',
            'temp/amd/lookup.js',
            'temp/amd/lifecycle.js',
            'temp/amd/lightbox.js',
            'temp/amd/listview.js',
            'temp/amd/pager.js',
            'temp/amd/personalize.js',
            'temp/amd/popdown.js',
            'temp/amd/popupmenu.js',
            'temp/amd/progress.js',
            'temp/amd/mask.js',
            'temp/amd/multiselect.js',
            'temp/amd/message.js',
            'temp/amd/modal.js',
            'temp/amd/modalsearch.js',
            'temp/amd/rating.js',
            'temp/amd/resize.js',
            'temp/amd/searchfield.js',
            'temp/amd/sidebar.js',
            'temp/amd/shell.js',
            'temp/amd/signin.js',
            'temp/amd/slider.js',
            'temp/amd/arrange.js',
            'temp/amd/spinbox.js',
            'temp/amd/splitter.js',
            'temp/amd/swaplist.js',
            'temp/amd/toast.js',
            'temp/amd/tabs.js',
            'temp/amd/tag.js',
            'temp/amd/textarea.js',
            'temp/amd/timepicker.js',
            'temp/amd/tmpl.js',
            'temp/amd/toolbar.js',
            'temp/amd/toolbarsearchfield.js',
            'temp/amd/tooltip.js',
            'temp/amd/tree.js',
            'temp/amd/validation.js',
            'temp/amd/wizard.js',
            'temp/amd/zoom.js'
          ]
        }
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
          {expand: true, flatten: true, src: ['js/vendor/svg4everybody.js'], dest: 'dist/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/svg4everybody.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/cultures/*.*'], dest: 'public/js/cultures/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/cultures/*.*'], dest: 'dist/js/cultures/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['svg/*.svg'], dest: 'dist/svg/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['svg/*.svg'], dest: 'public/svg/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['dist/svg/*.html'], dest: 'public/svg/', filter: 'isFile'}
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
          'dist/css/grey-theme.min.css': ['dist/css/grey-theme.css'],
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
            'dist/css/grey-theme.css',
            'dist/css/grey-theme.min.css',
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
      amd: ['temp']
    },

    'string-replace': {
      svg: {
        files: [
          {
            expand: true,
            cwd: 'views/controls',
            src: 'svg*.html',
            dest: 'dist/svg/'
          }
        ],
        options: {
          replacements: [
            {
              pattern: '<!-- NOTE:  This file gets automatically rewritten below this comment at build time.  Please make changes to the SVG files in the "<project-root>/svg" folder. -->',
              replacement: ''
            },
            {
              pattern: '{{> svg/svg}}',
              replacement: '<%= grunt.file.read("svg/icons.svg") %>'
            },
            {
              pattern: '{{> svg/svg-extended}}',
              replacement: '<%= grunt.file.read("svg/icons-extended.svg") %>'
            },
            {
              pattern: '{{> svg/svg-empty}}',
              replacement: '<%= grunt.file.read("svg/icons-empty.svg") %>'
            }
          ]
        }
      }
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
    }

  });

  // load all grunt tasks from 'node_modules' matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', [
    'revision',
    'jshint',
    'sass',
    'copy:amd',
    'string-replace',
    'strip_code',
    'concat',
    'clean',
    'uglify',
    'cssmin',
    'copy:main',
    'usebanner',
    'compress',
    'md2html'
  ]);

  // Don't do any uglify/minify/jshint while the Dev Watch is running.
  grunt.registerTask('sohoxi-watch', [
    'revision', 'sass', 'copy:amd', 'string-replace', 'strip_code','concat', 'clean', 'copy:main', 'usebanner'
  ]);

};
