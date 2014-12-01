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
          'public/stylesheets/site.css' : 'sass/site.scss',
          'public/stylesheets/highlight.css' : 'sass/highlight.scss'
        }
      }
    },

    watch: {
      source: {
        files: ['sass/**/*.scss', 'views/**.html', 'views/controls/**.html', 'js/*.js', 'js/cultures/*.*'],
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
        banner: '/*!\n Soho XI Controls v<%= pkg.version %> \n Date: <%= grunt.template.today("dd/mm/yyyy h:MM:ss TT") %> \n Revision: ' + process.env.SVN_REVISION + ' \n */ \n '
      },
      basic: {
        files: {
          'dist/js/<%= pkg.name %>.js': ['js/autocomplete.js', 'js/button.js', 'js/cardstack.js', 'js/datepicker.js', 'js/editor.js', 'js/datagrid.js', 'js/dropdown.js', 'js/draggable.js', 'js/form.js', 'js/locale.js', 'js/pager.js', 'js/popupmenu.js', 'js/mask.js', 'js/multiselect.js', 'js/message.js', 'js/modal.js', 'js/rating.js', 'js/spinbox.js', 'js/tabs.js', 'js/textarea.js', 'js/tmpl.js', 'js/tooltip.js','js/tree.js', 'js/slider.js', 'js/validation.js'],
          'dist/js/initialize.js': ['js/initialize.js']
        }
      }
    },

    uglify: {
      dist: {
        options: {
          banner: '/*!\n Soho 2.0 Controls v<%= pkg.version %> \n Date: <%= grunt.template.today("dd-mm-yyyy MM:hh:ss") %> \n Revision: ' + process.env.SVN_REVISION + ' \n */ \n ',
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
          {expand: true, flatten: true, src: ['fonts/opensans*'], dest: 'dist/fonts/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['fonts/opensans*'], dest: 'public/fonts/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['dist/js/initialize.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/demo/demo.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/demo/highlight.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-1*.min.js'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/vendor/jquery-1*min.map'], dest: 'public/js/', filter: 'isFile'},
          {expand: true, flatten: true, src: ['js/cultures/*.*'], dest: 'public/js/cultures/', filter: 'isFile'}
        ]
      }
    }
  });

  // load all grunt tasks from 'node_modules' matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);
  grunt.registerTask('default', ['jshint', 'sass', 'concat', 'uglify', 'copy:main']);
};
