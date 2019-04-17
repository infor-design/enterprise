#!/usr/bin/env node

/**
 * @overview
 * This script is a node script wrapper to build the color files.
 */

// -------------------------------------
// Requirements
// -------------------------------------
const createColorJson = require('./build/create-color-json');

// -------------------------------------
// Main
// -------------------------------------
createColorJson(true);
