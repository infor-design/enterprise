/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved */
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const cp = require('child_process');
const pjson = require('../package.json');

let commitHash = '';

const license = fs.readFileSync(path.join(__dirname, '..', 'LICENSE.md'), ['utf-8']);

commitHash = cp.execSync('git rev-parse HEAD');

const version2 = `Soho XI Controls v${pjson.version}`;
const date = `Date: ${moment().format('DD/MM/YYYY, h:mm:ss a')}`;
const revision = `Revision: ${commitHash}`;

module.exports = `${version2}\n${
  date}\n${
  revision}\n` +
  `\n${
    license}\n`;
