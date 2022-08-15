#!/usr/bin/env node

/**
 * This script is a command line wrapper for the `./build/sass.js` script
 * that runs Node Sass.
 */

// -------------------------------------
// Requirements
// -------------------------------------
import config from './configs/sass.js'
import buildSass from './build/sass.js';
import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
const argv = _yargs(hideBin(process.argv)).argv;

// -------------------------------------
// Main
// -------------------------------------
let type = 'dist';
if (argv.type) {
  type = argv.type;
}
if (!config.sass[type]) {
  throw new Error(`No "Node Sass" configuration available for type "${type}"`);
}

buildSass(config.sass[type]);
