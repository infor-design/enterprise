/* eslint-disable yoda */
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
 * @param {number|string|obj} r a number between 0-255 representing the amount of red. Can also be an object with `r`, `g`, and `b` values.
 * @param {number|string} g a number between 0-255 representing the amount of green
 * @param {number|string} b a number between 0-255 representing the amount of blue
 * @returns {string} containing the matching hexidecimal color value
 */
colorUtils.rgbToHex = function rgbToHex(r, g, b) {
  if (typeof r === 'object' && (typeof r.r === 'number' || typeof r.r === 'string')) {
    g = r.g;
    b = r.b;
    r = r.r;
  }
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
};

/**
 * Converts an RGB color value to an HSL color value
 * @param {number|string|obj} r a number between 0-255 representing the amount of red. Can also be an object with `r`, `g`, and `b` values.
 * @param {number|string} g a number between 0-255 representing the amount of green
 * @param {number|string} b a number between 0-255 representing the amount of blue
 * @returns {object} containing hue/saturation/lightness values (h, s, l).
 */
colorUtils.rgbToHsl = function rgbToHsl(r, g, b) {
  if (typeof r === 'object' && (typeof r.r === 'number' || typeof r.r === 'string')) {
    g = r.g;
    b = r.b;
    r = r.r;
  }

  // Ensure all values are numbers
  r = Number(r);
  g = Number(g);
  b = Number(b);

  // Make all the values fractions
  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest/smallest channel values
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  let h = 0;
  let s = 0;
  let l = 0;

  // Calculate Hue
  // delta of `0` means there is no adjustment.
  if (delta === 0) {
    h = 0;
  } else if (cmax === r) {
    // Red is max
    h = ((g - b) / delta) % 6;
  } else if (cmax === g) {
    // Green is Max
    h = (b - r) / delta + 2;
  } else {
    // Blue is Max
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);

  // If the hue comes out negative, make it a positive
  if (h < 0) {
    h += 360;
  }

  // Calculate Lightness
  l = (cmax + cmin) / 2;

  // Calculate Saturation
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
  }

  // multiply the final saturation/lightness values by 100 (make them percentages)
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return { h, s, l };
};

/**
 * Converts an HSL color value to an RGB color value
 * @param {number|string|obj} h a number between 0-255 representing the amount of red. Can also be an object with `h`, `s`, and `l` properties.
 * @param {number|string} s a number between 0-255 representing the amount of green
 * @param {number|string} l a number between 0-255 representing the amount of blue
 * @returns {object} containing hue/saturation/lightness values (h, s, l).
 */
colorUtils.hslToRgb = function hslToRgb(h, s, l) {
  if (typeof h === 'object' && (typeof h.h === 'number' || typeof h.h === 'string')) {
    h = h.h;
    s = h.s;
    l = h.l;
  }

  // Ensure all values are numbers
  h = Number(h);
  s = Number(s);
  l = Number(l);

  // make saturation/lightness fractions of 1
  s /= 100;
  l /= 100;

  // chroma (c), second largest component (x),
  // and amount to add to each channel to match lightness (m)
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  // whichever 60deg slice of an entire 360deg pie the hue lies within
  // determines the values for r/g/b
  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = x;
    b = c;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  // Add (m) to all channels, multiply each by 255, and round to get final values.
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
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

/**
 * Compares the luminosity of two hex colors.
 * @param {string|obj} baseColorHex a string representing a hexadecimal color
 * @param {string|obj} compareColorHex a string representing a hexadecimal color
 * @returns {boolean} true if the base color is more luminous, false if the compared color is more luminous.
 */
colorUtils.isLighter = function isLighter(baseColorHex, compareColorHex) {
  // Convert to RGB Objects
  const baseColorRGB = colorUtils.hexToRgb(baseColorHex);
  const compareColorRGB = colorUtils.hexToRgb(compareColorHex);

  // Convert to HSL Objects
  const baseColorHSL = colorUtils.rgbToHsl(baseColorRGB);
  const compareColorHSL = colorUtils.rgbToHsl(compareColorRGB);

  // Compare the HSL
  return baseColorHSL.l <= compareColorHSL.l;
};

export { colorUtils }; //eslint-disable-line
