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
  if (!enableConsoleLogging) {
    return;
  }

  if (!console) { // eslint-disable-line
    return;
  }

  if (!message && typeof type === 'string') {
    message = type;
    type = 'log';
  }

  if (typeof !console[type] !== 'function') {  // eslint-disable-line
    type = 'log';
  }

  console[type](`${message}`); // eslint-disable-line
}

/**
 * Returns a list of all elements that currently have a $.data() property.
 * @param {jQuery[]|HTMLElement} rootElem the root element to work from.
 * @returns {array} containing all matching elements with a data property attached.
 */
export function getComponents(rootElem) {
  const elem = !rootElem ? $('body') : $(rootElem);
  const allElems = elem.find('*');
  const results = [];

  allElems.each((i, thisElem) => {
    const data = $(thisElem).data();
    if (data && Object.keys(data).length) {
      results.push({
        data,
        element: thisElem
      });
    }
  });

  return results;
}
