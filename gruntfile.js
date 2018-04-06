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

  // Build out the Grunt config object
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

  // Default Task:
  // - Cleans up
  // - Builds
  // - Updates local documentation
  // - Zips
  grunt.registerTask('default', [
    'clean:dist',
    'build',
    'compress',
    'exec:documentation'
  ]);

  // Main build task (Gets everything)
  grunt.registerTask('build', [
    'build:js:min',
    'build:sass'
  ]);

  // Javascript Build Tasks
  // The first one doesn't minify (expensive, time-wise)
  grunt.registerTask('build:js', [
    'exec:build',
    'copy:main'
  ]);

  grunt.registerTask('build:js:min', [
    'exec:build',
    'exec:minify',
    'copy:main'
  ]);

  // SASS/CSS Build Task
  grunt.registerTask('build:sass', [
    'sass',
    'cssmin',
    'usebanner'
  ]);

  // Publish for NPM
  grunt.registerTask('publish', [
    'default',
    'clean:publish',
    'copy:publish'
  ]);

  // Watch Task
  grunt.registerTask('watch', [
    'chokidar'
  ]);
};
/* eslint-enable global-require, no-param-reassign,
  no-useless-concat, import/no-extraneous-dependencies */
