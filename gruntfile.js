module.exports = function(grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    banner: '/*!\n Soho XI Controls v<%= pkg.version %> \n Date: <%= grunt.template.today("dd/mm/yyyy h:MM:ss TT") %> \n Revision: <%= meta.revision %> \n */ \n ',

    sass: {
      dist: {
        files: {
          'public/stylesheets/grey-theme.css' : 'sass/grey-theme.scss',
          'public/stylesheets/dark-theme.css' : 'sass/dark-theme.scss',
          'public/stylesheets/508-theme.css' : 'sass/508-theme.scss',
          'public/stylesheets/css-only.css' : 'sass/css-only.scss',
          'public/stylesheets/demo.css' : 'sass/demo.scss',
          'public/stylesheets/site.css' : 'sass/site.scss'
        }
      }
    },

    watch: {
      source: {
        files: ['sass/**/*.scss', 'views/docs/**.html', 'views/**.html', 'views/controls/**.html', 'js/*/*.js', 'js/*.js', 'js/cultures/*.*'],
        tasks: ['revision', 'sass', 'concat', 'uglify', 'copy'],
        options: {
          livereload: true
        }
      }
    },

    jshint: {
      files: ['gruntfile.js', 'app.js', 'js/*.js', 'src/*/*.js'],
      options: {
        jshintrc: '.jshintrc',
      }
    },

    concat: {
      options: {
        separator: '',
        banner: '<%= banner %>',
        footer: '//# sourceURL=<%= pkg.name %>.js'
      },
      basic: {
        files: {
          'dist/js/<%= pkg.name %>.js': [
            'js/autocomplete.js',
            'js/busyindicator.js',
            'js/button.js',
            'js/colorpicker.js',
            'js/chart.js',
            'js/datepicker.js',
            'js/datagrid.js',
            'js/dropdown.js',
            'js/draggable.js',
            'js/editor.js',
            'js/form.js',
            'js/initialize.js',
            'js/listview.js',
            'js/locale.js',
            'js/pager.js',
            'js/popupmenu.js',
            'js/mask.js',
            'js/multiselect.js',
            'js/message.js',
            'js/modal.js',
            'js/rating.js',
            'js/resizable.js',
            'js/searchfield.js',
            'js/slider.js',
            'js/spinbox.js',
            'js/toast.js',
            'js/tabs.js',
            'js/textarea.js',
            'js/timepicker.js',
            'js/tmpl.js',
            'js/toolbar.js',
            'js/tooltip.js',
            'js/tree.js',
            'js/validation.js'
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
          {expand: true, flatten: true, src: ['public/stylesheets/*-theme.css'], dest: 'dist/css/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['public/stylesheets/css-only.css'], dest: 'dist/css/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/demo/demo.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/demo/syntax.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-1*.min.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-1*.map'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/d3.min.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/d3.map'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/cultures/*.*'], dest: 'public/js/cultures/', filter: 'isFile'}
        ]
      }
    },

    // Minify css
    cssmin: {
      dist: {
        files: {
          'dist/css/508-theme.min.css': ['dist/css/508-theme.css'],
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
            'dist/css/css-only.min.css'
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
    }

  });

  // load all grunt tasks from 'node_modules' matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);
  grunt.registerTask('default', ['revision', 'jshint', 'sass', 'concat', 'uglify', 'copy:main', 'cssmin', 'usebanner']);
};
