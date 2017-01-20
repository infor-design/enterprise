module.exports = function(grunt) {
  grunt.file.defaultEncoding = 'utf-8';
  grunt.file.preserveBOM = true;

  const sass = require('./build/configs/sass.js'),
    watch = require('./build/configs/watch.js'),
    amdHeader = require('./build/configs/amdHeader.js'),
    copy = require('./build/configs/copy.js'),
    cssmin = require('./build/configs/cssmin.js'),
    usebanner = require('./build/configs/usebanner.js'),
    documentation = require('./build/configs/documentation.js'),
    compress = require('./build/configs/compress.js'),
    meta = require('./build/configs/meta.js'),
    revision = require('./build/configs/revision.js'),
    md2html = require('./build/configs/md2html.js'),
    stripCode = require('./build/configs/strip_code.js'),
    clean = require('./build/configs/clean.js'),
    jshint = require('./build/configs/jshint.js'),
    uglify = require('./build/configs/uglify.js'),
    dependencyBuilder = require('./build/dependencybuilder.js'),
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

  let config = {

    pkg: grunt.file.readJSON('package.json'),

    banner: bannerText,

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
    }

  };

  grunt.initConfig(Object.assign({},
    config,
    watch,
    clean,
    jshint,
    sass,
    meta,
    amdHeader,
    copy,
    cssmin,
    documentation,
    revision,
    stripCode,
    uglify,
    usebanner,
    compress,
    md2html
  ));

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
    'copy:amd',
    'strip_code',
    'concat:basic',
  ]);

  // Don't do any uglify/minify/jshint while the Dev Watch is running.
  grunt.registerTask('sohoxi-watch', [
    'revision', 'sass', 'copy:amd', 'strip_code','concat', 'clean:amd', 'copy:main', 'usebanner'
  ]);
};
