#!/usr/bin/env node

/**
 * IDS Enterprise Minify Process
 */

// -------------------------------------
// Requirements
// -------------------------------------
import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import logger from './logger.js';
import runBuildProcess from './build/run-build-process.js';

const argv = _yargs(hideBin(process.argv)).argv;

// -------------------------------------
// Main
// -------------------------------------

const cssArgs = ['./scripts/minify-css'];
const jsArgs = ['./scripts/minify-js'];

if (argv.verbose) {
  const vb = '--verbose';
  cssArgs.push(vb);
  jsArgs.push(vb);
}

const minifyPromises = [
  runBuildProcess(`node ${cssArgs.join(' ')}`),
  runBuildProcess(`node ${jsArgs.join(' ')}`)
];

Promise.all(minifyPromises).then(() => {
  logger('success', 'All Minification Complete!');
  process.exit(0);
});
