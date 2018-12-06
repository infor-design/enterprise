#!/usr/bin/env node

/**
 * This script is a command line wrapper for the `./build/sass.js` script
 * that runs Node Sass.
 */

// -------------------------------------
// Requirements
// -------------------------------------
const commandLineArgs = require('yargs').argv;

const config = require('./configs/sass').sass;
const buildSass = require('./build/sass');

// -------------------------------------
// Main
// -------------------------------------
let type = 'dist';
if (commandLineArgs.type) {
  type = commandLineArgs.type;
}
if (!config[type]) {
  throw new Error(`No "Node Sass" configuration available for type "${type}"`);
}

module.exports = buildSass(config[type]);
