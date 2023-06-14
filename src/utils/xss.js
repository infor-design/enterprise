const xssUtils = {};

/**
 * Takes a string and removes all html tags
 * @param {string} str The string to parse
 * @returns {string} The string minus html tags.
 */
xssUtils.stripHTML = function stripHTML(str) {
  let newStr = str;

  if (!newStr) {
    return '';
  }

  newStr = newStr.replace(/<\/?[^>]+(>|$)/g, '');
  return newStr;
};

/**
 * Remove all html tags except for the ones specified. I.E. White list to a specific set of accepted tags.
 * @private
 * @param {string} html HTML in string form
 * @param {string} allowed Comma seperated string of allowed tags e.g. '<b><i><p>''
 * @returns {string} the modified value
 */
xssUtils.stripTags = function (html, allowed) {
  if (!html) {
    return '';
  }

  if (typeof html === 'number') {
    return html;
  }

  const allowList = ((`${allowed || ''}`)
    .toLowerCase()
    .match(/<[a-z][a-z0-9]*>/g) || [])
    .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)

  const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  const commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  let returnHTML = '';
  returnHTML = html.replace(commentsAndPhpTags, '')
    .replace(tags, ($0, $1) => allowList.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''); //eslint-disable-line
  returnHTML = returnHTML.replace(tags, ($0, $1) => allowList.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''); //eslint-disable-line
  returnHTML = returnHTML.replace(tags, ($0, $1) => allowList.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''); //eslint-disable-line

  return returnHTML;
};

/**
 * Remove console methods
 * @private
 * @param {string} html HTML in string form
 * @returns {string} the modified value
 */
xssUtils.sanitizeConsoleMethods = function (html) {
  const methods = ['assert', 'clear', 'count', 'debug', 'dirxml', 'dir', 'error', 'exception', 'groupCollapsed', 'groupEnd', 'group', 'info', 'log', 'markTimeline', 'profileEnd', 'profile', 'table', 'timeEnd', 'timeStamp', 'time', 'trace', 'warn'];
  const expr = new RegExp(`console\\.(${methods.join('|')})((\\s+)?\\(([^)]+)\\);?)?`, 'igm');

  return typeof html !== 'string' ? html : html.replace(expr, '');
};

/**
 * Remove Script tags and all onXXX functions
 * @private
 * @param {string} html HTML in string form
 * @returns {string} the modified value
 */
xssUtils.sanitizeHTML = function (html) {
  if (!html) return '';
  // Remove on xxx functions https://regex101.com/r/hsLeFl/1/
  let santizedHtml = html.replace(/\bon\w+=\S+?(?=(>|&|<| |"))/g, '');
  // Remove Script tags
  santizedHtml = santizedHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g, '');
  // Remove iframe tags
  santizedHtml = santizedHtml.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/g, '');

  // Remove console methods
  santizedHtml = this.sanitizeConsoleMethods(santizedHtml);
  // Remove nested script tags
  santizedHtml = santizedHtml.replace(/<\/script>/g, '');

  return santizedHtml;
};

/**
 * Changing all of white-spaces characters to a single
 * space in the whole string then removes all exceeding
 * white-spaces before and after the text.
 * @private
 * @param {object} html the HTML object to get the inner html value.
 * @returns {string} the new value of inner html.
 */
xssUtils.removeWhiteSpaceCharacters = function (html) {
  if (!html) {
    return '';
  }

  let value = html[0].innerHTML;
  value = value.replace(/\s+/g, ' ').trim();
  html[0].innerHTML = value;

  return html[0].innerHTML;
};

/**
 * Make sure a string is only alphanumeric (with dashes allowed.)
 * @private
 * @param {string} string HTML in string form
 * @returns {string} the modified value
 */
xssUtils.ensureAlphaNumeric = function (string) {
  if (typeof string === 'number') {
    return string;
  }
  return this.stripTags(string).replace(/[^a-z0-9-]/gi, '', '');
};

/**
 * Make sure a string is only alphanumeric with spaces.
 * @private
 * @param {string} string HTML in string form
 * @returns {string} the modified value
 */
xssUtils.ensureAlphaNumericWithSpaces = function (string) {
  if (typeof string === 'number') {
    return string;
  }
  return this.stripTags(string).replace(/[^a-z0-9 ]/gi, '', '');
};

/**
 * Converting given string into camel case.
 * @private
 * @param {string} string To be convert into camel case
 * @returns {string} the modified value
 */
xssUtils.toCamelCase = function (string) {
  if (typeof string !== 'string') {
    return string;
  }
  string = this.stripTags(string).replace(/[^a-z0-9 ]/gi, '', '');
  return string.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
};

/**
 * Escapes HTML, replacing special characters with encoded symbols.
 * Symbols taken from https://bit.ly/1iVkGlc
 * @private
 * @param {string} value HTML in string form
 * @returns {string} the modified value
 */
xssUtils.escapeHTML = function (value) {
  const newValue = value;
  if (typeof newValue === 'string') {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;',
      '\\': '&bsol;'
    };
    const reg = /[&<>"'\\]/ig;
    return newValue.replace(reg, match => (map[match]));
  }
  return newValue;
};

/**
 * Un-escapes HTML, replacing encoded symbols with special characters.
 * Symbols taken from https://bit.ly/1iVkGlc
 * @private
 * @param {string} value HTML in string form
 * @returns {string} the modified value
 */
xssUtils.unescapeHTML = function (value) {
  if (value === '') {
    return '';
  }

  if (typeof value === 'string') {
    const match = regx => ((value.match(regx) || [''])[0]);
    const doc = new DOMParser().parseFromString(value, 'text/html');

    // Keep leading/trailing spaces
    return `${match(/^\s*|\\/)}${doc.documentElement.textContent.trim()}${match(/\s*$|\\/)}`;
  }
  return value;
};

/**
 * htmlentities() is a PHP function which converts special characters (like <)
 * into their escaped/encoded values (like &lt;). This is a JS verson of it.
 * This allows you to show to display the string without the browser reading it as HTML.
 * This is useful for encoding hrefs.
 * @private
 * @param {string} string string to process
 * @returns {string} the processed value
 */
xssUtils.htmlEntities = function (string) {
  return String(string)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\\/g, '&bsol;')
    .replace(/"/g, '&quot;');
};

/**
 * Ensure that a link is a local link (relative to the current page)
 * @private
 * @param {string} url string to process
 * @returns {boolean} If it is local or not
 */
xssUtils.isUrlLocal = function (url) {
  const isEmpty = (url === '');
  return !isEmpty &&
    ((url[0] === '/' && (url.length === 1 || (url[1] !== '/' && url[1] !== '\\'))) || // "/" or "/foo" but not "//" or "/\"
    (url.length > 1 && url[0] === '~' && url[1] === '/')) || // "~/" or "~/foo"
    (url.length >= 1 && url[0] === '#'); // "#" or "#foo"
};

export { xssUtils };
