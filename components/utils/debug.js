//=====================================================
// Soho Debugging Utils
//=====================================================

//=====================================================
// Timer-logging functions
//=====================================================
/**
 * Easy flag for determining whether or not time will be logged to the console.
 */
export let enableTimeLogging = false;


/**
 * @param {String} [label]
 */
export function logTimeStart(label) {
  if (enableTimeLogging) {
    console.time(label); // jshint ignore:line
  }
}


/**
 * @param {String} [label]
 */
export function logTimeEnd(label) {
  if (enableTimeLogging) {
    console.timeEnd(label); // jshint ignore:line
  }
}
