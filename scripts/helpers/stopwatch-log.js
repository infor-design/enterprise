'use strict';

const chalk = require('chalk');
const logSymbols = require('log-symbols');

/**
 * @class stopwatchLog
 * Allows you to log the starting and stopping of tasks with elapsed time
 */
class StopwatchLog {

  /**
   * Create a stopwatchLog instance
   */
  constructor() {
    this.stopwatch = {};
  }

  /**
   * Log an individual task's action
   * @param {string} action - the action
   * @param {string} desc - a brief description or more details
   * @param {string} [color] - one of the chalk module's color aliases
   */
  logTaskAction(action, desc, color = 'green') {
    console.log('-', action, chalk[color](desc));
  }

  /**
   * Console.log a finished action and display its run time
   * @param {string} taskName - the name of the task that matches its start time
   */
  logTaskEnd(taskName) {
    console.log('Finished', chalk.cyan(taskName), `after ${chalk.magenta(this.timeElapsed(this.stopwatch[taskName]))}`);
  }

  /**
   * Console.log a staring action and track its start time
   * @param {string} taskName - the unique name of the task
   * @returns {string}
   */
  logTaskStart(taskName) {
    this.stopwatch[taskName] = Date.now();
    console.log('\nStarting', chalk.cyan(taskName), '...');
    return taskName;
  }

  /**
   * Log a failed message
   * @param {string} [desc] - a brief description or more details
   */
  error(desc = '') {
    console.error(`\n`, logSymbols.error, chalk['red'](desc), `\n`);
  }

  /**
   * Log a success message
   * @param {string} [desc] - a brief description or more details
   */
  success(desc = '') {
    console.log(logSymbols.success, chalk['green'](desc));
  }

  /**
   * Calculate the time (in seconds) elapsed from a previous tiemstamp to now.
   * @param {number} startTime - a time in milliseconds
   * @return {string} - "0.00s"
   */
  timeElapsed(startTime) {
    const elapsed = ((Date.now() - startTime)/1000).toFixed(2);
    return elapsed + 's';
  }
}

module.exports = new StopwatchLog();
