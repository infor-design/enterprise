// ===============================================
// Wraps `console.log` so we don't have errors
// all over the place.
// ===============================================
const logTypes = [
  'normal', 'timestamp', 'success', 'info', 'error', 'alert', 'skip', 'callout'
];

// Icon types
const CHECKMARK = '\u2713';
const ERROR_X = '\u24E7';
const INFO_I = '\u24D8';
const WARN = '\u26A0';
const NDASH = '\u2013';
const CALLOUT = '\u00BB';
const BEER = '🍻';

// Pad the left of the console string, in the event we
// have some icons in the logs.
function pad(n) {
  let ret = '';
  let j = n;
  if (isNaN(j)) { //eslint-disable-line
    j = 0;
  }
  while (j > 0) {
    ret += ' ';
    --j;
  }
  return ret;
}

// Simple wrapper for `console.log`
export default function logger(type, msg) {
  let consoleType = type;
  let consoleMsg = msg;

  if (!consoleType && !msg) {
    consoleType = logTypes[0];
    consoleMsg = msg || '';
  }
  if (!msg && msg !== '') {
    consoleMsg = type;
    consoleType = logTypes[0];
  }

  // Console lines can be prefixed with certain icon types or padding.
  // Useful when multiple logger lines are used to display steps in a process.
  // If not needed, simply use `undefined` in the type, or use "normal".
  let prefix = '';
  switch (consoleType) {
    case 'padded':
      prefix = pad(3);
      break;
    case 'timestamp':
      prefix = new Date().toISOString().replace('T', ' ').replace('Z', '') + pad(1);
      break;
    case 'success':
      prefix = CHECKMARK + pad(2);
      break;
    case 'error':
      prefix = ERROR_X + pad(2);
      break;
    case 'alert':
      prefix = WARN + pad(2);
      break;
    case 'skip':
      prefix = NDASH + pad(2);
      break;
    case 'bullet':
      prefix = NDASH + pad(2);
      break;
    case 'info':
      prefix = INFO_I + pad(2);
      break;
    case 'callout':
      prefix = CALLOUT + pad(1);
      break;
    case 'beer':
      prefix = BEER + pad(1);
      break;
    default: // normal
      break;
  }

  if (console) {
    // eslint-disable-next-line
    console.log(prefix + consoleMsg);
  }
}
