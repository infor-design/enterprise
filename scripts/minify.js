#!/usr/bin/env node
/* eslint-disable */
/* =================================================
 * Soho Xi Minify Process (Uglify-ES Wrapper)
 * ============================================== */
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const UglifyJS = require('uglify-es');

// Soho Xi Uglify Configs
const config = require('./configs/uglify');
const ENCODING = 'utf-8';

// Get the uncompressed, transpiled `sohoxi.js` from Rollup.
const fullInputFilePath = path.resolve(__dirname, '..', config.inputFileName);
let TRANSPILED_CODE = fs.readFileSync(fullInputFilePath, ENCODING, function (err, data) {
  if (err) {
    console.log(chalk.red('Error getting uncompressed code: ') + err);
    process.exit(1);
  }
});
if (TRANSPILED_CODE) {
  console.log('Successfully opened uncompressed code.');
}

// Get the contents of the uncompressed sourceMap file.
const fullInputSourceMapFilePath = path.resolve(__dirname, '..', config.inputSourceMapFileName);
config.uglify.sourceMap.content = fs.readFileSync(fullInputSourceMapFilePath, ENCODING, function (err, data) {
  if (err) {
    console.log(chalk.red('Error getting uncompressed sourceMap: ') + err);
    process.exit(1);
  }
});
if (config.uglify.sourceMap.content) {
  console.log('Successfully opened uncompressed sourceMap.');
}

// Run Uglify-ES and get the result
const result = UglifyJS.minify(TRANSPILED_CODE, config.uglify);
if (result.error) {
  console.log(chalk.red('Error running Uglify-ES: ') + result.error);
  process.exit(1);
}
console.log('Successfully finished UglifyJS process.');

// Save the minified code
const codeResult = fs.writeFileSync(path.resolve(__dirname, '..', config.outputFileName), result.code);
console.log('Successfully saved minified code.');

// Save the updated sourcemap
const sourceMapResult = fs.writeFileSync(path.resolve(__dirname, '..', config.outputSourceMapFileName), result.map);
console.log('Successfully saved minified code\'s sourceMap file.');

console.log(chalk.green('Minify Complete!'));
process.exit(0);
