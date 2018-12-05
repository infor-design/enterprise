const { spawn } = require('child_process');

const logger = require('../logger');

let log = '';

function sanitizeData(data) {
  return data.toString('utf8').trim();
}

function logLine(data) {
  const line = sanitizeData(data);
  log += line;
  logger(line);
}

/**
 * Runs a single build process
 * @param {string} terminalCommand the base terminal command
 * @param {array} terminalArgs series of command arguments
 * @returns {Promise} resolves the process's log
 */
module.exports = function runBuildProcess(terminalCommand, terminalArgs) {
  if (!terminalCommand) {
    throw new Error(`"${terminalCommand}" must be a valid terminal command`);
  }
  if (!Array.isArray(terminalArgs)) {
    terminalArgs = [];
  }

  return new Promise((resolve, reject) => {
    const buildProcess = spawn(terminalCommand, terminalArgs);
    buildProcess.stdout.on('data', logLine);
    buildProcess.stderr.on('data', logLine);
    buildProcess.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`"${terminalCommand}" process exited with error code (${code})\nArgs: ${terminalArgs.join(' ')}`));
      }
      resolve(log);
    });
  });
};
