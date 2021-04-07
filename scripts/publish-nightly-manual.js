#!/usr/bin/env node

/**
 * @fileoverview Append the date to the library package.json version
 * @example `node ./scripts/version-add-date.js`
 */

// -------------------------------------
//   Node Modules/Options
// -------------------------------------
const fs = require('fs');
const slash = require('slash');
const inquirer = require('inquirer');


// -------------------------------------
//   Constants
// -------------------------------------
const rootPath = slash(process.cwd());
const pkgJsonPath = `${rootPath}/package.json`;
const pkgJson = require(pkgJsonPath);
const versionTag = 'dev';

// -------------------------------------
//   Functions
// -------------------------------------

/**
 * Format the date as YYYYMMDD
 * @param {date} date
 */
function formatDate (date) {
  var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('');
}

/**
 * Executes the command on the cli
 * @param {string} cmd - The command
 */
function executeUpdate(cmd) {
  const exec = require('child_process').exec
  const updateProcess = exec(cmd, (err, stdout, stderr) => {
    if (err) {
      logError(`exec error: ${err}`);
      return;
    }
    console.log(stdout);
    console.log(stderr);
  });
}

/**
 * Extract the base semver from a valid semver string
 * @param {string} str - The version from the package.json
 * @return {string} - The base version, i.e. "X.Y.Z-dev"
 */
function getBaseVersion(str) {
  return str.substr(0, str.indexOf(versionTag) + versionTag.length);
}

// -------------------------------------
//   Main
// -------------------------------------
console.log('Manually publish a nightly build...');

if (pkgJson.version.indexOf('-dev') === -1) {
  console.log('Error! Cannot append date to non-dev version. Are you on the main branch?');
  return false;
}

const questionsArr = [{
  type: 'list',
  name: 'tag',
  message: 'Choose the day to update to:',
  choices: ['Today', 'Yesterday']
}];

inquirer.prompt(questionsArr).then((answers) => {
  let d = new Date();
  if (answers.tag === 'Yesterday') {
    d = d.setDate(d.getDate() - 1);
  }

  const suffixDate = formatDate(d);

  pkgJson.version = `${getBaseVersion(pkgJson.version)}.${suffixDate}`;
  const dataStr = JSON.stringify(pkgJson, null, 2) + '\n'; //eslint-disable-line

  const cmdArr = [
    'git status -sb',
    'npm run build',
    'npm run zip-dist',
    'npm publish --tag=dev',
    'echo Reset the package.json version',
    'git checkout package.json'
  ];

  // Write the file with the new version
  fs.writeFile(pkgJsonPath, dataStr, 'utf8', () => {
    executeUpdate(cmdArr.join(' && '));
  });
});
