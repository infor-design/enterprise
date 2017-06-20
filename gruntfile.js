module.exports = function(grunt) {
  grunt.file.defaultEncoding = 'utf-8';
  grunt.file.preserveBOM = true;

  const sass = require('./build/configs/sass.js'),
    chokidar = require('./build/configs/watch.js'),
    amdHeader = require('./build/configs/amdHeader.js'),
    copy = require('./build/configs/copy.js'),
    cssmin = require('./build/configs/cssmin.js'),
    usebanner = require('./build/configs/usebanner.js'),
    compress = require('./build/configs/compress.js'),
    meta = require('./build/configs/meta.js'),
    revision = require('./build/configs/revision.js'),
    stripCode = require('./build/configs/strip_code.js'),
    clean = require('./build/configs/clean.js'),
    jshint = require('./build/configs/jshint.js'),
    uglify = require('./build/configs/uglify.js'),
    dependencyBuilder = require('./build/dependencybuilder.js'),
    strBanner = require('./build/strbanner.js'),
    controls = require('./build/controls.js'),
    run = require('./build/configs/run.js');

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
    chokidar,
    clean,
    jshint,
    sass,
    meta,
    amdHeader,
    copy,
    cssmin,
    revision,
    stripCode,
    uglify,
    usebanner,
    compress,
    run
  ));

  // load all grunt tasks from 'node_modules' matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);
  //require('load-grunt-parent-tasks')(grunt);

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
    'compress',
    'usebanner',
    'run:documentation'
  ]);

  grunt.registerTask('js', [
    'copy:amd',
    'strip_code',
    'concat:basic'
  ]);

  grunt.registerTask('js-uglify', [
    'copy:amd',
    'strip_code',
    'concat:basic',
    'uglify'
  ]);

  grunt.registerTask('publish', [
    'revision',
    'sass',
    'copy:amd',
    'strip_code',
    'concat',
    'clean:amd',
    'copy:main',
    'usebanner',
    'clean:publish',
    'copy:publish'
  ]);

  // Swap "watch" for "chokidar"
  grunt.registerTask('watch', ['chokidar']);

  // Run the event to regen docs
  grunt.event.on('chokidar', function(action, filepath) {
    if (filepath.indexOf('components') > -1 && (filepath.indexOf('.js') > -1 || filepath.indexOf('.md') > -1)) {
      //grunt.log.writeln('Generating Docs for ' + ': ' + filepath );
      var runConfig = grunt.config.get(['run']),
        componentName = filepath.substr(filepath.lastIndexOf('/')+1).replace('.js','').replace('.md','');

      runConfig.documentation.args[2] = componentName;
      grunt.config.set('run', runConfig);
      grunt.task.run('run:documentation');
    }
  });

  // Don't do any uglify/minify/jshint while the Dev Watch is running.
  grunt.registerTask('sohoxi-watch', [
    'revision', 'sass', 'copy:amd', 'strip_code','concat', 'clean:amd', 'copy:main', 'usebanner'
  ]);
};
