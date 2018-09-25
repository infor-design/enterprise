/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved */
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const cp = require('child_process');
const pjson = require('../package.json');
const args = require('yargs').argv;

let commitHash = '';
let isCustom = '';
let componentsArgs;
let componentsList = '';

if (args.customBuild) {
  isCustom = ' (custom)';
}
if (args.components) {
  componentsArgs = args.components.split(',');

  componentsList += 'Custom bundle containing the following components:\n';
  componentsArgs.forEach((comp) => {
    componentsList += `- ${comp}\n`;
  });
  componentsList += '\n';
}

const license = fs.readFileSync(path.join(__dirname, '..', 'LICENSE'), ['utf-8']);

commitHash = cp.execSync('git rev-parse HEAD');

const version2 = `Soho XI Controls v${pjson.version}${isCustom}`;
const date = `Date: ${moment().format('DD/MM/YYYY, h:mm:ss a')}`;
const revision = `Revision: ${commitHash}`;

module.exports = `${version2}\n${
  date}\n${
  revision}\n${
  componentsList}${
  license}\n`;
