// ================================================= /
// IDS Enterprise - Rollup Configuration
// ================================================= /
const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const json = require('rollup-plugin-json');
const license = require('rollup-plugin-license');
const commandLineArgs = require('yargs').argv;

const bundleBanner = require('./scripts/generate-bundle-banner');

const config = {
  input: 'src/index.js',
  output: {
    file: 'dist/js/sohoxi.js',
    format: 'iife',
    sourcemap: true,
    sourcemapFile: 'dist/js/sohoxi.js.map',
    name: 'Soho',
    globals: {
      jquery: '$',
      d3: 'd3',
      alert: 'alert',
      console: 'console'
    }
  },
  plugins: [
    resolve(),
    json(),
    babel({
      exclude: 'node_modules/**'
    }),
    license({
      sourceMap: true,
      banner: bundleBanner
    })
  ],
};

// Use auto-generated build entry points for Rollup.
// NOTE: The IDS Custom build system must have generated files into the `/temp` folder
// before this can run.
if (commandLineArgs.components) {
  config.input = 'temp/index.js';
}

module.exports = config;
