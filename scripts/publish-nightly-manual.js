/* eslint-disable consistent-return */
/* eslint-disable no-console */

/**
 * @fileoverview Append the date to the library package.json version
 * @example `node ./scripts/version-add-date.js`
 */

// -------------------------------------
//   Node Modules/Options
// -------------------------------------
import * as fs from 'fs';
import slash from 'slash';
import inquirer from 'inquirer';
import * as child from 'child_process';

const loadJSON = path => JSON.parse(fs.readFileSync(new URL(path, import.meta.url)));
const pkgJson = loadJSON('../package.json');

// -------------------------------------
//   Constants
// -------------------------------------
const rootPath = slash(process.cwd());
const pkgJsonPath = `${rootPath}/package.json`;
const versionTag = 'dev';

// -------------------------------------
//   Functions
// -------------------------------------

/**
 * Format the date as YYYYMMDD
 * @param {date} date
 */
function formatDate(date) {
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;

  return [year, month, day].join('');
}

/**
 * Executes the command on the cli
 * @param {string} cmd - The command
 */
function executeUpdate(cmd) {
  child.exec(cmd, (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
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

function checkVersion() {
  if (pkgJson.version.indexOf('-dev') === -1) {
    console.log('Error! Cannot append date to non-dev version. Are you on the main branch?');
    return false;
  }

  return true;
}

// -------------------------------------
//   Main
// -------------------------------------
console.log('Manually publish a nightly build...');

checkVersion();

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
    'npm publish --tag=dev',
    'echo Reset the package.json version',
    'git checkout package.json'
  ];

  // Write the file with the new version
  fs.writeFile(pkgJsonPath, dataStr, 'utf8', () => {
    executeUpdate(cmdArr.join(' && '));
  });
});
