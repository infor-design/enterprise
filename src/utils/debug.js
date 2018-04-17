/* eslint-disable no-console */

// Easy flag for determining whether or not time will be logged to the console.
export const enableTimeLogging = false;

/**
 * Start the logging timer
 * @param  {string} label Provide a way to match a timing operation.
 * @returns {void}
 */
export function logTimeStart(label) {
  if (enableTimeLogging) {
    console.time(label);
  }
}

/**
 * End the logging timer and print the result
 * @param  {string} label End this matching timing operation
 * @returns {void}
 */
export function logTimeEnd(label) {
  if (enableTimeLogging) {
    console.timeEnd(label);
  }
}

// Easy flag for allowing console debugging
export const enableConsoleLogging = false;

/**
 * Simple wrapper for `console.[whatever]` to abstract out console access.
 * @param {string} type console display type
 * @param {string} message message type
 * @returns {void}
 */
export function log(type, message) {
  if (!console) { // eslint-disable-line
    return;
  }

  if (typeof !console[type] !== 'function') {  // eslint-disable-line
    type = 'log';
  }

  console[type](`${message}`); // eslint-disable-line
}
