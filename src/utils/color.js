const colorUtils = {};

/**
 * Convert the provided hex to an RGBA with an opacity.
 * @private
 * @param {string} hex to set.
 * @param {string} opacity to check.
 * @returns {string} converted rgba
 */
colorUtils.hexToRgba = function hexToRgba(hex, opacity) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');

    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }

    c = `0x${c.join('')}`;
    // eslint-disable-next-line
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${opacity.toString()})`;
  }
  return '';
};

/**
* Takes a color and performs a change in luminosity of that color programatically.
* @private
* @param {string} hex  The original Hexadecimal base color.
* @param {string} lum  A percentage used to set luminosity
* change on the base color:  -0.1 would be 10% darker, 0.2 would be 20% brighter
* @returns {string} hexadecimal color.
*/
colorUtils.getLuminousColorShade = function getLuminousColorShade(hex, lum) {
  // validate hex string
  hex = this.validateHex(hex).substr(1);
  lum = lum || 0;

  // convert to decimal and change luminosity
  let rgb = '#';
  let c;
  let i;

  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += (`00${c}`).substr(c.length);
  }

  return rgb;
};

/**
 * Validates a string containing a hexadecimal number
 * @private
 * @param {string} hex A hex color.
 * @returns {string} a validated hexadecimal string.
 */
colorUtils.validateHex = function validateHex(hex) {
  hex = String(hex).replace(/[^0-9a-f]/gi, '');

  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  return `#${hex}`;
};

export { colorUtils }; //eslint-disable-line
