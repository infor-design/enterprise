module.exports = function(grunt) {
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    sass: {
      dist: {
        files: {
          'public/stylesheets/grey-theme.css' : 'sass/grey-theme.scss',
          'public/stylesheets/dark-theme.css' : 'sass/dark-theme.scss',
          'public/stylesheets/508-theme.css' : 'sass/508-theme.scss',
          'public/stylesheets/demo.css' : 'sass/demo.scss',
          'public/stylesheets/site.css' : 'sass/site.scss'
        }
      }
    },

    watch: {
      source: {
        files: ['sass/**/*.scss', 'views/**.html', 'views/controls/**.html', 'js/*/*.js', 'js/*.js', 'js/cultures/*.*'],
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
        banner: '/*!\n Soho XI Controls v<%= pkg.version %> \n Date: <%= grunt.template.today("dd/mm/yyyy h:MM:ss TT") %> \n Revision: ' + process.env.SVN_REVISION + ' \n */ \n ',
        footer: '//# sourceURL=<%= pkg.name %>.js'
      },
      basic: {
        files: {
          'dist/js/<%= pkg.name %>.js': ['js/autocomplete.js', 'js/busyindicator.js', 'js/button.js', 'js/cardlist.js', 'js/colorpicker.js', 'js/chart.js', 'js/datepicker.js', 'js/datagrid.js', 'js/dropdown.js', 'js/draggable.js', 'js/editor.js', 'js/form.js', 'js/initialize.js', 'js/locale.js', 'js/pager.js', 'js/popupmenu.js', 'js/mask.js', 'js/multiselect.js', 'js/message.js', 'js/modal.js', 'js/rating.js', 'js/resizable.js', 'js/spinbox.js', 'js/toast.js', 'js/tabs.js', 'js/textarea.js', 'js/timepicker.js', 'js/tmpl.js', 'js/tooltip.js','js/tree.js', 'js/slider.js', 'js/validation.js']
        }
      }
    },

    uglify: {
      dist: {
        options: {
          banner: '/*!\n Soho XI Controls v<%= pkg.version %> \n Date: <%= grunt.template.today("dd-mm-yyyy MM:hh:ss") %> \n Revision: ' + process.env.SVN_REVISION + ' \n */ \n ',
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
          {expand: true, flatten: true, src: ['js/demo/demo.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/demo/syntax.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-1*.min.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-1*min.map'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/d3.min.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/cultures/*.*'], dest: 'public/js/cultures/', filter: 'isFile'}
        ]
      }
    }
  });

  // load all grunt tasks from 'node_modules' matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);
  grunt.registerTask('default', ['jshint', 'sass', 'concat', 'uglify', 'copy:main']);
};
