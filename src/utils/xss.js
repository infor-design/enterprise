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
  const whitelist = ((`${allowed || ''}`)
    .toLowerCase()
    .match(/<[a-z][a-z0-9]*>/g) || [])
    .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)

  const tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  const commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;

  return html.replace(commentsAndPhpTags, '')
    .replace(tags, ($0, $1) => whitelist.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : ''); //eslint-disable-line
};

/**
 * Remove Script tags and all onXXX functions
 * @private
 * @param {string} html HTML in string form
 * @returns {string} the modified value
 */
xssUtils.sanitizeHTML = function (html) {
  let santizedHtml = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/g, '');
  santizedHtml = santizedHtml.replace(/<[^>]+/g, match => match.replace(/(\/|\s)on\w+=(\'|")?[^"]*(\'|")?/g, '')); // eslint-disable-line

  // Remove console.logs
  santizedHtml = santizedHtml.replace(/console.log(\b[^<]*(?:(?!\);)<[^<]*)*);/g, '');
  santizedHtml = santizedHtml.replace(/console.log(\b[^<]*(?:(?!\))<[^<]*)*)/g, '');

  // Remove nested script tags
  santizedHtml = santizedHtml.replace(/<\/script>/g, '');

  return santizedHtml;
};

export { xssUtils }; //eslint-disable-line
