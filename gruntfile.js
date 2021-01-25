module.exports = function (grunt) {
  grunt.file.defaultEncoding = 'utf-8';
  grunt.file.preserveBOM = true;

  const copy = require('./scripts/configs/copy.js');
  const cssmin = require('./scripts/configs/cssmin.js');
  const compress = require('./scripts/configs/compress.js');

  const config = {
    pkg: grunt.file.readJSON('package.json'),
    exec: {
      build: {
        cmd: 'npm run build',
      },
      'clean-dist': {
        cmd: 'npm run clean:dist'
      },
      'clean-docs': {
        cmd: 'npm run clean:docs',
      },
      'clean-app': {
        cmd: 'npm run clean:app'
      },
      rollup: {
        cmd: 'npx rollup -c'
      },
      sass: {
        cmd: (configType) => {
          configType = configType || 'dist';
          if (configType === 'app') {
            return `node ./scripts/build-sass --type=${configType}`;
          }
          return `node ./scripts/build --disable-js --disable-copy --type=${configType}`;
        }
      },
      documentation: {
        cmd: (componentName) => {
          componentName = componentName || '';
          return `npm run documentation ${componentName}`;
        }
      },
      'minify-js': {
        cmd: 'node ./scripts/minify-js.js'
      },
      'minify-css': {
        cmd: 'node ./scripts/minify-css.js'
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
    copy,
    cssmin,
    compress
  ));

  // load all grunt tasks from 'node_modules' matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  // Default Task:
  // - Cleans up
  // - Builds
  // - Minifies
  grunt.registerTask('default', [
    'exec:clean-dist',
    'exec:build',
    'exec:minify'
  ]);

  // Main build task (Gets everything)
  // NOTE: Better to run `npm run build`, which can run these simultaneously
  grunt.registerTask('build', [
    'build:js:min',
    'build:sass'
  ]);

  // Demo build tasks. Generates CSS specific to the Demoapp
  grunt.registerTask('demo', [
    'exec:clean-app',
    'exec:sass:app'
  ]);

  // Javascript Build Tasks
  // The first one doesn't minify (expensive, time-wise)
  grunt.registerTask('build:js', [
    'exec:rollup',
    'copy:main'
  ]);
  grunt.registerTask('build:js:min', [
    'exec:rollup',
    'exec:minify-js',
    'copy:main'
  ]);

  // SASS/CSS Build Task
  grunt.registerTask('build:sass', () => {
    const comps = grunt.option('components');
    if (comps) {
      grunt.log.writeln(`Compiling custom CSS library with components "${comps}"...`);
      grunt.task.run('exec:sass:custom');
    } else {
      grunt.task.run('exec:sass');
    }
    grunt.task.run('cssmin');
  });

  // Zip dist folder for download from the git releases page.
  grunt.registerTask('zip-dist', [
    'compress'
  ]);
};
/* eslint-enable global-require, no-param-reassign,
  no-useless-concat, import/no-extraneous-dependencies */
