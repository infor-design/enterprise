const colorUtils = {};

// Safely converts a single RGBA color component (R, G, B, or A) to
// its corresponding two-digit hexidecimal value.
function componentToHex(c) {
  const hex = Number(c).toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}

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
 * Converts a hex color to an object containing separate R, G, and B values.
 * @param {string} hex string representing a hexidecimal color
 * @returns {object|null} containing separate "r", "g", and "b" values.
 */
colorUtils.hexToRgb = function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

/**
 * Takes separate R, G, and B values, and converts them to a hexidecimal string
 * @param {number|string} r a number between 0-255 representing the amount of red
 * @param {number|string} g a number between 0-255 representing the amount of green
 * @param {number|string} b a number between 0-255 representing the amount of blue
 * @returns {string} containing the matching hexidecimal color value
 */
colorUtils.rgbToHex = function rgbToHex(r, g, b) {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
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

/**
 * Get calculated contrast color
 * @private
 * @param {string} hex A hex color.
 * @param {string} light Optional a custom hex color to return.
 * @param {string} dark Optional a custom hex color to return.
 * @returns {string} a calculated contrast color string.
 */
colorUtils.getContrastColor = function getContrastColor(hex, light, dark) {
  hex = hex ? hex.replace('#', '') : '';
  const parse = x => parseInt(hex.substr(x, 2), 16);
  const r = parse(0);
  const g = parse(2);
  const b = parse(4);
  const diff = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (diff >= 128) ? (dark || 'black') : (light || 'white');
};

/**
 * Returns a less saturated shade of a provided color.
 * @param {string} hex the starting hexadecimal color
 * @param {number} [sat=1] a number representing a percentage change (between 0 and 1) of saturation.
 * @returns {string} the modified hexidecimal color
 */
colorUtils.getDesaturatedColor = function getDesaturatedColor(hex, sat = 1) {
  hex = hex ? hex.replace('#', '') : '';
  const col = colorUtils.hexToRgb(hex);

  // Grayscale constants
  // https://en.m.wikipedia.org/wiki/Grayscale#Luma_coding_in_video_systems
  const gray = col.r * 0.3086 + col.g * 0.6094 + col.b * 0.0820;

  col.r = Math.round(col.r * sat + gray * (1 - sat));
  col.g = Math.round(col.g * sat + gray * (1 - sat));
  col.b = Math.round(col.b * sat + gray * (1 - sat));

  return colorUtils.rgbToHex(col.r, col.g, col.b);
};

export { colorUtils }; //eslint-disable-line
