#!/usr/bin/env node
/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved */
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const childProcess = require('child_process');
const pjson = require('../package.json');
const args = require('yargs').argv;

// CR-LF on Windows, LF on Linux/Mac
const NL = process.platform === 'win32' ? '\r\n' : '\n';

const projectName = 'IDS Enterprise Components';
const commitHash = childProcess.execSync('git rev-parse HEAD') || '';

function prependLines(str, prepender) {
  prepender = prepender || '';
  const strArr = str.split(NL);
  // eslint-disable-next-line
  for (let x in strArr) {
    strArr[x] = `${prepender}${strArr[x].trim()}`;
  }
  return strArr.join(NL);
}

/**
 * Generate the IDS Bundle Banner
 * @param {boolean} useComments if true, prepends comment syntax around the banner lines
 * @returns {string} containing the bundle banner
 */
function render(useComments) {
  const startComment = useComments ? '/*! ' : '';
  const comment = useComments ? ' *  ' : '';
  const endComment = useComments ? ' */ ' : '';
  const date = `Date: ${moment().toISOString()}`;
  const revision = `Revision: ${commitHash}`.trim();
  let isCustom = '';
  let componentsArgs;
  let componentsList = '';

  // Grabs a list of included components (optional)
  if (args.components) {
    isCustom = ' (custom)';
    componentsArgs = args.components.split(',');

    componentsList += 'Custom bundle containing the following components:';
    componentsArgs.forEach((comp) => {
      componentsList += `${NL}${comment} - ${comp}`;
    });
    componentsList += `${NL}${comment}`;
  }

  // Project Name and Version Headline
  const headline = `${projectName} - v${pjson.version}${isCustom}`;

  // Prepend comments to each line of the license
  let license = fs.readFileSync(path.join(__dirname, '..', 'LICENSE'), 'utf8');
  license = prependLines(license, comment);

  return `${startComment}${NL}${
    comment}${headline}${NL}${
    comment}${date}${NL}${
    comment}${revision}${NL}${
    comment}${NL}${
    comment}${componentsList}${NL}${
    license}${NL}${
    endComment}`;
}

// default export is just the string (backwards compat)
module.exports = render(true);
