#!/usr/bin/env node

/**
 * @overview
 * This script is a node script wrapper to build the icon svg html files
 */

// -------------------------------------
// Requirements
// -------------------------------------
// const createSvgHtml = require('./build/create-svg-html');

import createSvgHtml from './build/create-svg-html.js';

// -------------------------------------
// Main
// -------------------------------------
createSvgHtml(true);
