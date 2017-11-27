//================================================= /
// Soho Xi - Rollup Configuration
//================================================= /
var resolve = require('rollup-plugin-node-resolve');
var babel = require('rollup-plugin-babel');
var json = require('rollup-plugin-json');
var license = require('rollup-plugin-license');

var bundleBanner = require('./build/generate-bundle-banner');

module.exports = {
  input: 'components/index.js',
  output: {
    file: 'dist/js/sohoxi.js',
    format: 'iife',
  },
  sourcemap: true,
  sourcemapFile: 'dist/js/sohoxi.js.map',
  name: 'Soho',
  plugins: [
    resolve(),
    json(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    license({
      sourceMap: true,
      banner: bundleBanner
    })
  ],
  globals: {
    jquery: '$',
    d3: 'd3',
    alert: 'alert',
    console: 'console'
  }
};
