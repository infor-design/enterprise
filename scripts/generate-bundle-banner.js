/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import child_process from 'child_process';
import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = _yargs(hideBin(process.argv)).argv;

const exec = child_process;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Using the environment variables
const version = process.env.npm_package_version;

// CR-LF on Windows, LF on Linux/Mac
const NL = process.platform === 'win32' ? '\r\n' : '\n';

const projectName = 'IDS Enterprise Components';
const commitHash = exec.execSync('git rev-parse HEAD') || '';

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
  const date = `Date: ${new Date().toISOString()}`;
  const revision = `Revision: ${commitHash}`.trim();
  let isCustom = '';
  let componentsArgs;
  let componentsList = '';

  // Grabs a list of included components (optional)
  if (argv.components) {
    isCustom = ' (custom)';
    componentsArgs = argv.components.split(',');

    componentsList += 'Custom bundle containing the following components:';
    componentsArgs.forEach((comp) => {
      componentsList += `${NL}${comment} - ${comp}`;
    });
    componentsList += `${NL}${comment}`;
  }

  // Project Name and Version Headline
  const headline = `${projectName} - v${version}${isCustom}`;

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

export default render(true);
