#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies, function-paren-newline,
  no-console, no-restricted-syntax, no-continue, no-loop-func, prefer-template */

/**
 * @fileoverview TESTING ONLY!!
 * This script is used to serve a basic DocumentJS site
 * of all the [components/components.js] files to check for documentation
 * accuracy and consistency.
 *
 * @example `node ./build/test-serve-documentation.js`
 */

// -------------------------------------
//   Node Modules/Options
// -------------------------------------
const argv = require('yargs').argv;
const chalk = require('chalk');
const documentation = require('documentation');
const glob = require('glob');
const { exec } = require('child_process');


// -------------------------------------
//   Constants
// -------------------------------------
const arrOfFiles = [];
const rootPath = process.cwd();
const paths = {
  components:  `components`,
};
const stopwatch = {};

// -------------------------------------
//   Main
// -------------------------------------
logTaskStart('generate command');

glob(`${paths.components}/*/`, (err, componentDirs) => {
  for (compDir of componentDirs) {
    compName = deriveComponentName(compDir);
    arrOfFiles.push(`${compDir}${compName}.js`);
  }

  let documentationCmd = 'npx documentation serve ';
  documentationCmd += arrOfFiles.join(' ');
  documentationCmd += ' --watch --shallow --sort-order alpha';

  logTaskEnd('generate command');
  logTaskStart('run command');

  const timer = setTimeout(() => {
    logTaskAction('DocumentationJS', `serving on port 4001`)
    logTaskEnd('run command');
  }, 15000);

  exec(documentationCmd, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      clearTimeout(timer);
      return;
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
});


// -------------------------------------
//   Functions
// -------------------------------------

/**
 * Derive the component name from its folder path
 * @param {string} dirPath - the component's directory path
 * @return {string} - the component's name
 */
function deriveComponentName(dirPath) {
  return dirPath
    .replace(`${paths.components}/`, '')
    .slice(0, -1);
}

/**
 * Log an individual task's action
 * @param {string} action - the action
 * @param {string} desc - a brief description or more details
 * @param {string} [color] - one of the chalk module's color aliases
 */
function logTaskAction(action, desc, color = 'green') {
  console.log('-', action, chalk[color](desc));
}

/**
 * Console.log a staring action and track its start time
 * @param {string} taskName - the unique name of the task
 */
function logTaskStart(taskName) {
  stopwatch[taskName] = Date.now();
  console.log('Starting', chalk.cyan(taskName), '...');
}

/**
 * Console.log a finished action and display its run time
 * @param {string} taskName - the name of the task that matches its start time
 */
function logTaskEnd(taskName) {
  console.log('Finished', chalk.cyan(taskName), `after ${chalk.magenta(timeElapsed(stopwatch[taskName]))}`);
}

/**
 * Calculate the difference in seconds
 * @param {number} t - a time in milliseconds elapsed since January 1, 1970 00:00:00 UTC.
 * @return {string}
 */
function timeElapsed(t) {
  const elapsed = ((Date.now() - t)/1000).toFixed(1);
  return elapsed + 's';
}
