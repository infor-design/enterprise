/* eslint-disable no-underscore-dangle */
import * as path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import _yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Internal
import logger from '../logger.js';

const argv = _yargs(hideBin(process.argv)).argv;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Runs a single build process
 * @param {string} cmd the entire terminal command, with arguments
 * @returns {Promise} resolves the process's log
 */
export default function runBuildProcess(cmd) {
  if (!cmd) {
    throw new Error(`"${cmd}" must be a valid terminal command`);
  }

  return new Promise((resolve, reject) => {
    if (argv.verbose) {
      logger('info', `Running "${cmd}"...`);
    }

    const buildProcess = spawn(cmd, {
      cwd: path.resolve(__dirname, '..', '..'),
      shell: true,
      stdio: 'inherit'
    });

    buildProcess.on('error', (e, fileName, lineNumber) => {
      let lineText = '';
      if (lineNumber) {
        lineText = `at "${lineNumber}"`;
      }
      let fileText = '';
      if (fileName) {
        fileText = ` in "${fileName}"`;
      }

      logger('error', `[${cmd}]: ${e.message}${lineText}${fileText}`);
    });

    buildProcess.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`"${cmd}" process exited with error code (${code})\nArgs:`));
      }
      if (argv.verbose) {
        logger('success', `Build process "${cmd}" finished sucessfully`);
      }
      resolve();
    });
  });
}
