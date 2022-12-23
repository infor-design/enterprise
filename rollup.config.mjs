/* eslint-disable import/no-extraneous-dependencies */
// ================================================= /
// IDS Enterprise - Rollup Configuration
// ================================================= /
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import { babel } from '@rollup/plugin-babel';
import license from 'rollup-plugin-license';
import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import getTargetBundleTypes from './scripts/rollup-plugins/bundle-types.js';
import render from './scripts/generate-bundle-banner.js';

const argv = _yargs(hideBin(process.argv)).argv;

// Globals are reused in both configs
const globals = {
  jquery: '$',
  d3: 'd3',
  alert: 'alert',
  console: 'console',
};

// Hook into `onwarn` to supress certain warning messages.
const supressedWarningCodes = [
  'CIRCULAR_DEPENDENCY',
  'THIS_IS_UNDEFINED',
  'UNKNOWN_OPTION'
];
function onwarn(warning, next) {
  if (supressedWarningCodes.includes(warning.code)) {
    return;
  }
  next(warning);
}

// ================================================= /
// Standard Configuration used for IIFE Bundles,
// intended for use by inline script tag within the page.
// ================================================= /
const standardConfig = {
  input: 'src/index.js',
  output: {
    file: 'dist/js/sohoxi.js',
    format: 'iife',
    sourcemap: true,
    sourcemapFile: 'dist/js/sohoxi.js.map',
    name: 'Soho',
    globals
  },
  onwarn,
  plugins: [
    resolve(),
    json(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    }),
    license({
      sourcemap: true,
      banner: render
    })
  ],
};

// ================================================= /
// ES Module Configuration.  This bundle allows for
// other libraries to import IDS through a single entry point.
// No sourcemaps are provided on purpose (the bundler used by a
// consuming application should be able to do this, if needed).
// ================================================= /
const esmConfig = {
  input: 'src/index.js',
  output: {
    file: 'dist/js/sohoxi.esm.js',
    format: 'es',
    globals
  },
  name: 'Soho',
  onwarn,
  plugins: [
    resolve(),
    json(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled'
    }),
    license({
      sourcemap: true,
      banner: render
    })
  ],
};

// Use auto-generated build entry points for Rollup.
// NOTE: The IDS Custom build system must have generated files into the `/temp` folder
// before this can run.
if (argv.components) {
  standardConfig.input = 'temp/index.js';
  esmConfig.input = 'temp/index.js';
}

// If the `types` flag is passed, separate its arguments and figure out what should be bundled.
// Otherwise, only build the standard bundle.  Some of these are aliases.  See the switch() statement
// for which bundles add up to which types.
const exports = getTargetBundleTypes({
  standard: standardConfig,
  esm: esmConfig
});

export default exports;
