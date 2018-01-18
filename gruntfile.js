/* eslint-disable global-require, no-param-reassign,
  no-useless-concat, import/no-extraneous-dependencies */
module.exports = function (grunt) {
  grunt.file.defaultEncoding = 'utf-8';
  grunt.file.preserveBOM = true;

  const sass = require('./build/configs/sass.js');
  const chokidar = require('./build/configs/watch.js');
  const amdHeader = require('./build/configs/amdHeader.js');
  const copy = require('./build/configs/copy.js');
  const cssmin = require('./build/configs/cssmin.js');
  const usebanner = require('./build/configs/usebanner.js');
  const compress = require('./build/configs/compress.js');
  const meta = require('./build/configs/meta.js');
  // const revision = require('./build/configs/revision.js');
  // const stripCode = require('./build/configs/strip_code.js');
  const clean = require('./build/configs/clean.js');
  const jshint = require('./build/configs/jshint.js');
  // uglify = require('./build/configs/uglify.js');
  const dependencyBuilder = require('./build/dependencybuilder.js');
  const strBanner = require('./build/strbanner.js');
  const controls = require('./build/controls.js');
  const run = require('./build/configs/run.js');

  let selectedControls = dependencyBuilder(grunt);
  let bannerText = '/**\n* Soho XI Controls v<%= pkg.version %>\n* Date: <%= grunt.template.today("dd/mm/yyyy h:MM:ss TT") %>\n* Revision: <%= meta.revision %>\n* <%= meta.copyright %>\n*/\n';

  if (selectedControls) {
    const bannerList = strBanner(selectedControls);
    bannerText = `/**\n* Soho XI Controls v<%= pkg.version %>\n* ${bannerList}\n* Date: <%= grunt.template.today("dd/mm/yyyy h:MM:ss TT") %>\n* Revision: <%= meta.revision %>\n* <%= meta.copyright %>\n*/ \n`;
  } else {
    selectedControls = controls;
  }

  const config = {

    pkg: grunt.file.readJSON('package.json'),

    banner: bannerText,

    concat: {
      options: {
        separator: '',
        banner: '<%= banner %>' + '<%= amdHeader %>',
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
        filter(filepath) {
          if (!grunt.file.exists(filepath)) {
            grunt.fail.warn(`Could not find: ${filepath}`);
            return false;
          }
          return true;
        },
        nonull: true
      }
    }
  };

  grunt.initConfig(Object.assign(
    {},
    config,
    chokidar,
    clean,
    jshint,
    sass,
    meta,
    amdHeader,
    copy,
    cssmin,
    // revision,
    // stripCode,
    // uglify,
    usebanner,
    compress,
    run
  ));

  // load all grunt tasks from 'node_modules' matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);
  // require('load-grunt-parent-tasks')(grunt);

  grunt.registerTask('build', [
    'run:build'
  ]);

  grunt.registerTask('default', [
    'clean:dist',
    'clean:public',
    // 'revision',
    'jshint',
    'sass',
    // 'copy:amd',
    // 'strip_code',
    'run:build',
    // 'clean:amd',
    'uglify',
    'cssmin',
    'copy:main',
    'compress',
    'usebanner'
  ]);

  grunt.registerTask('js', [
    // 'revision',
    // 'copy:amd',
    // 'strip_code',
    // 'concat:basic'
    'run:build'
  ]);

  grunt.registerTask('js-uglify', [
    // 'revision',
    // 'copy:amd',
    // 'strip_code',
    // 'concat:basic',
    'run:build',
    // 'uglify'
  ]);

  grunt.registerTask('publish', [
    'clean:dist',
    'clean:public',
    // 'revision',
    'jshint',
    'sass',
    // 'copy:amd',
    // 'strip_code',
    'run:build',
    // 'clean:amd',
    // 'uglify',
    'cssmin',
    'copy:main',
    'compress',
    'usebanner',
    'clean:publish',
    'copy:publish'
  ]);

  // Swap "watch" for "chokidar"
  grunt.registerTask('watch', [
    'chokidar'
  ]);

  // Run the event to regen docs
  grunt.event.on('chokidar', (action, filepath) => {
    if (filepath.indexOf('components') > -1 && (filepath.indexOf('.js') > -1 || filepath.indexOf('.md') > -1)) {
      // grunt.log.writeln('Generating Docs for ' + ': ' + filepath );
      const runConfig = grunt.config.get(['run']);
      const componentName = filepath.substr(filepath.lastIndexOf('/') + 1).replace('.js', '').replace('.md', '');

      runConfig.documentation.args[2] = componentName;
      grunt.config.set('run', runConfig);
      grunt.task.run('run:documentation');
    }
  });

  // Don't do any uglify/minify/jshint while the Dev Watch is running.
  grunt.registerTask('sohoxi-watch', [
    'sass',
    /* 'copy:amd', */
    /* 'strip_code', */
    'run:build',
    /* 'clean:amd', */
    'copy:main',
    'usebanner'
  ]);
};
/* eslint-enable global-require, no-param-reassign,
  no-useless-concat, import/no-extraneous-dependencies */
