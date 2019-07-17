const logger = require('../logger');

// Matches required font weights as defined by the Design System:
// https://github.com/infor-design/design-system/blob/master/design-tokens/theme-uplift/theme.json#L80-L84
const STANDARD_WEIGHTS = [
  '300',
  '400',
  '600'
].join(',');

// Noto Sans doesn't support the 600 weight, so we opt for 700 instead.
const NOTO_SANS_WEIGHTS = [
  '300',
  '400',
  '700'
].join(',');

// Arabic locales use the Mada font
const MADA_LOCALES = [
  'ar-SA',
  'ar-EG'
];

// Hindi, Japanese, Korean, and Chinese locales use the Noto Sans font
const NOTO_SANS_LOCALES = [
  'hi-IN',
  'ja-JP',
  'ko-KR',
  'zh-CN',
  'zh-tw',
  'zh-Hans',
  'zh-Hant'
];

// Hebrew locales use the Assistant font
const ASSISTANT_LOCALE = 'he-IL';

// Font Switching Middleware.
// For the IDS Uplift theme variants, certain Locales require specific fonts.
// See the discussion on https://github.com/infor-design/design-system/issues/385
module.exports = function () {
  return function optionHandlerFonts(req, res, next) {
    const localeString = res.opts.locale;
    let changedLocale = false;
    let fontFamily = 'Source+Sans+Pro';
    let fontWeights = STANDARD_WEIGHTS;
    let fontSubset = '';

    // Activate if using a locale other than the default.
    // Currently pulled from Google Fonts.
    if (localeString !== 'en-US') {
      changedLocale = true;

      // Arabic
      if (MADA_LOCALES.includes(localeString)) {
        fontFamily = 'Mada';
        fontSubset = 'arabic';
      }

      // Hebrew
      if (localeString === ASSISTANT_LOCALE) {
        fontFamily = 'Assistant';
        fontSubset = 'hebrew';
      }

      // Chinese, Hindi, Japanese, Korean, Vietnamese
      if (NOTO_SANS_LOCALES.includes(localeString)) {
        fontFamily = 'Noto+Sans';
        fontWeights = NOTO_SANS_WEIGHTS;

        // Serve Traditional Chinese (Taiwan, others)
        if (['zh-tw', 'zh-hant'].includes(localeString)) {
          fontFamily += '+TC';
          fontSubset = 'chinese-traditional';
        }

        // Serve Simplified Chinese (PRC)
        if (['zh-CN', 'zh-Hans'].includes(localeString)) {
          fontFamily += '+SC';
          fontSubset = 'chinese-simplified';
        }

        // Serve Japanese
        // NOTE: does not have a 600-weight variant
        if (localeString === 'ja-JP') {
          fontFamily += '+JP';
          fontSubset = 'japanese';
        }

        // Serve Korean
        if (localeString === 'ko-KR') {
          fontFamily += '+KR';
          fontSubset = 'korean';
        }

        // Hindi uses the Devanagari subset
        if (localeString === 'hi-IN') {
          fontSubset = 'devanagari';
        }
      }

      // Vietnamese subset
      if (localeString === 'vi-VN') {
        fontSubset = 'vietnamese';
      }
    }

    // Render the fontString option
    const renderedSubset = fontSubset.length ? `&subset=${fontSubset}` : '';
    res.opts.fontString = `family=${fontFamily}:${fontWeights}&display=swap${renderedSubset}`;

    // Log the difference
    if (changedLocale) {
      logger('info', `Locale "${localeString}" requires font string "${res.opts.fontString}".`);
    }

    next();
  };
};
