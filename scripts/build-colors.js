#!/usr/bin/env node

/**
 * @overview
 * This script is a node script wrapper to build the color files.
 */

// -------------------------------------
// Requirements
// -------------------------------------
import createColorJson from './build/create-color-json.js';

// -------------------------------------
// Main
// -------------------------------------
createColorJson(true);
