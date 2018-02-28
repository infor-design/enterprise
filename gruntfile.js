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
  const clean = require('./build/configs/clean.js');
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
    },

    exec: {
      build: {
        cmd: 'npm run build'
      },

      documentation: {
        cmd: (componentName) => {
          componentName = componentName || '';
          return `npm run documentation ${componentName}`;
        }
      },

      minify: {
        cmd: 'npm run minify'
      }
    },

  };

  grunt.initConfig(Object.assign(
    {},
    config,
    chokidar,
    clean,
    sass,
    meta,
    amdHeader,
    copy,
    cssmin,
    usebanner,
    compress,
    run
  ));

  // load all grunt tasks from 'node_modules' matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('build', [
    'exec:build'
  ]);

  grunt.registerTask('default', [
    'clean:dist',
    'clean:public',
    // 'revision',
    'sass',
    // 'copy:amd',
    // 'strip_code',
    'build',
    // 'clean:amd',
    'exec:minify',
    'cssmin',
    'copy:main',
    'compress',
    'usebanner'
  ]);

  grunt.registerTask('js', [
    // 'copy:amd',
    'build'
  ]);

  grunt.registerTask('js-uglify', [
    // 'concat:basic',
    'build',
    'exec:minify'
  ]);

  grunt.registerTask('publish', [
    'clean:dist',
    'clean:public',
    'sass',
    'build',
    'exec:minify',
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
      const componentName = filepath.substr(filepath.lastIndexOf('/') + 1).replace('.js', '').replace('.md', '');
      grunt.task.run(`exec:documentation:${componentName}`);
    }
  });

  // Don't do any uglify/minify while the Dev Watch is running.
  grunt.registerTask('sohoxi-watch', [
    'sass',
    /* 'copy:amd', */
    'build',
    /* 'clean:amd', */
    'copy:main',
    'usebanner'
  ]);
};
/* eslint-enable global-require, no-param-reassign,
  no-useless-concat, import/no-extraneous-dependencies */
