/* eslint-disable global-require, no-param-reassign,
  no-useless-concat, import/no-extraneous-dependencies */
module.exports = function (grunt) {
  grunt.file.defaultEncoding = 'utf-8';
  grunt.file.preserveBOM = true;

  const sass = require('./scripts/configs/sass.js');
  const chokidar = require('./scripts/configs/watch.js');
  const copy = require('./scripts/configs/copy.js');
  const cssmin = require('./scripts/configs/cssmin.js');
  const usebanner = require('./scripts/configs/usebanner.js');
  const compress = require('./scripts/configs/compress.js');
  const clean = require('./scripts/configs/clean.js');

  const bannerText = require('./scripts/generate-bundle-banner');

  const config = {
    pkg: grunt.file.readJSON('package.json'),
    banner: bannerText,
    exec: {
      rollup: {
        cmd: 'npx rollup -c'
      },
      documentation: {
        cmd: (componentName) => {
          componentName = componentName || '';
          return `npm run documentation ${componentName}`;
        }
      },
      minify: {
        cmd: 'node ./scripts/minify.js'
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
    copy,
    cssmin,
    usebanner,
    compress
  ));

  // load all grunt tasks from 'node_modules' matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  // Default Task:
  // - Cleans up
  // - Builds
  // - Updates local documentation
  grunt.registerTask('default', [
    'clean',
    'build'
  ]);

  // Main build task (Gets everything)
  grunt.registerTask('build', [
    'build:js:min',
    'build:sass'
  ]);

  // Demo build tasks
  grunt.registerTask('demo', [
    'clean:app',
    'sass:app'
  ]);

  // Javascript Build Tasks
  // The first one doesn't minify (expensive, time-wise)
  grunt.registerTask('build:js', [
    'exec:rollup',
    'copy:main'
  ]);

  grunt.registerTask('build:js:min', [
    'exec:rollup',
    'exec:minify',
    'copy:main'
  ]);

  // SASS/CSS Build Task
  grunt.registerTask('build:sass', () => {
    const comps = grunt.option('components');
    if (comps) {
      grunt.log.writeln(`Compiling custom CSS library with components "${comps}"...`);
      grunt.task.run('sass:custom');
    } else {
      grunt.task.run('sass:dist');
    }
    grunt.task.run('cssmin');
    grunt.task.run('usebanner');
  });

  // Zip dist folder for download from the git releases page.
  grunt.registerTask('zip-dist', [
    'compress'
  ]);

  // Watch Task
  grunt.registerTask('watch', [
    'chokidar'
  ]);
};
/* eslint-enable global-require, no-param-reassign,
  no-useless-concat, import/no-extraneous-dependencies */
