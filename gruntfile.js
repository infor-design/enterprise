/* eslint-disable global-require, no-param-reassign,
  no-useless-concat, import/no-extraneous-dependencies */
module.exports = function (grunt) {
  grunt.file.defaultEncoding = 'utf-8';
  grunt.file.preserveBOM = true;

  const sass = require('./scripts/configs/sass.js');
  const chokidar = require('./scripts/configs/watch.js');
  const amdHeader = require('./scripts/configs/amdHeader.js');
  const copy = require('./scripts/configs/copy.js');
  const cssmin = require('./scripts/configs/cssmin.js');
  const usebanner = require('./scripts/configs/usebanner.js');
  const compress = require('./scripts/configs/compress.js');
  const meta = require('./scripts/configs/meta.js');
  const clean = require('./scripts/configs/clean.js');
  const dependencyBuilder = require('./scripts/dependencybuilder.js');
  const strBanner = require('./scripts/strbanner.js');
  const controls = require('./scripts/controls.js');
  const run = require('./scripts/configs/run.js');

  let selectedControls = dependencyBuilder(grunt);
  let bannerText = '/**\n* Soho XI Controls v<%= pkg.version %>\n* Date: <%= grunt.template.today("dd/mm/yyyy h:MM:ss TT") %>\n* Revision: <%= meta.revision %>\n* <%= meta.copyright %>\n*/\n';

  if (selectedControls) {
    const bannerList = strBanner(selectedControls);
    bannerText = `/**\n* Soho XI Controls v<%= pkg.version %>\n* ${bannerList}\n* Date: <%= grunt.template.today("dd/mm/yyyy h:MM:ss TT") %>\n* Revision: <%= meta.revision %>\n* <%= meta.copyright %>\n*/ \n`;
  } else {
    selectedControls = controls;
  }

  const config = {
    pkg: grunt.file.readJSON('publish/package.json'),

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
    'clean',
    'build',
    'compress'
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
