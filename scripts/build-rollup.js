#!/usr/bin/env node

/**
 * IDS Enterprise Components
 * Rollup Bundle Wrapper
 */

const commandLineArgs = require('yargs').argv;

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const rollup = require('rollup');

const logger = require('./logger');

const config = require('../rollup.config');

// adjust paths to account for this script being run from `scripts/`
config.input = `../${config.input}`;
config.output.file = `../${config.output.file}`;
config.output.sourcemapFile = `../${config.output.sourcemapFile}`;

// setup an onwarn function that hooks into our logger
config.onwarn = function onwarn(warning, warn) {
  logger('warn', warning);
  warn(warning);
};

async function build() {
  const bundle = await rollup.rollup(config.input);

  logger('info', bundle.imports);
  logger('info', bundle.exports);
  logger('info', bundle.modules);

  await bundle.write(config.output);
}

build();
