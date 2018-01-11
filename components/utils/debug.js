/* eslint-disable no-console */

// Easy flag for determining whether or not time will be logged to the console.
export const enableTimeLogging = false;

/**
 * Start the logging timer
 * @param  {string} label Provide a way to match a timing operation.
 * @return {void}
 */
export function logTimeStart(label) {
  if (enableTimeLogging) {
    console.time(label); // jshint ignore:line
  }
}

/**
 * End the logging timer and print the result
 * @param  {string} label End this matching timing operation
 * @return {void}
 */
export function logTimeEnd(label) {
  if (enableTimeLogging) {
    console.timeEnd(label); // jshint ignore:line
  }
}
