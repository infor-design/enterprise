const path = require('path');
const { spawn } = require('child_process');
const commandLineArgs = require('yargs').argv;

const logger = require('../logger');

/**
 * Runs a single build process
 * @param {string} cmd the entire terminal command, with arguments
 * @returns {Promise} resolves the process's log
 */
module.exports = function runBuildProcess(cmd) {
  if (!cmd) {
    throw new Error(`"${cmd}" must be a valid terminal command`);
  }

  return new Promise((resolve, reject) => {
    if (commandLineArgs.verbose) {
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
      if (commandLineArgs.verbose) {
        logger('success', `Build process "${cmd}" finished sucessfully`);
      }
      resolve();
    });
  });
};
