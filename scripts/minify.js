#!/usr/bin/env node

/**
 * IDS Enterprise Minify Process (Uglify-ES Wrapper)
 */

// -------------------------------------
// Requirements
// -------------------------------------
const logger = require('./logger');
const minifyJSResults = require('./minify-js');
const minifyCSSResults = require('./minify-css');

// -------------------------------------
// Main
// -------------------------------------
Promise.all([minifyCSSResults, minifyJSResults]).then(() => {
  logger('success', 'All Minification Complete!');
  process.exit(0);
});
