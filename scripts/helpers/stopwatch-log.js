/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import logSymbols from 'log-symbols';

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
   */
  logTaskAction(action, desc) {
    console.log('-', action, desc);
  }

  /**
   * Console.log a finished action and display its run time
   * @param {string} taskName - the name of the task that matches its start time
   */
  logTaskEnd(taskName) {
    console.log('Finished', taskName, `after ${this.timeElapsed(this.stopwatch[taskName])}`);
  }

  /**
   * Console.log a staring action and track its start time
   * @param {string} taskName - the unique name of the task
   * @returns {string}
   */
  logTaskStart(taskName) {
    this.stopwatch[taskName] = Date.now();
    console.log('\nStarting', taskName, '...');
    return taskName;
  }

  /**
   * Log a failed message
   * @param {string} [desc] - a brief description or more details
   */
  error(desc = '') {
    console.error('\n', logSymbols.error, desc, '\n');
  }

  /**
   * Log a success message
   * @param {string} [desc] - a brief description or more details
   */
  success(desc = '') {
    console.log(logSymbols.success, desc);
  }

  /**
   * Calculate the time (in seconds) elapsed from a previous tiemstamp to now.
   * @param {number} startTime - a time in milliseconds
   * @return {string} - "0.00s"
   */
  timeElapsed(startTime) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    return `${elapsed}s`;
  }
}

export default new StopwatchLog();
