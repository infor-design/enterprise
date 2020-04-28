/**
 * Source Code Lint Rules
 * NOTE: Remember that this cascades on top of the rules from the project root folder.
 */
module.exports = {
  'parser': 'babel-eslint',

  'plugins': [
    'compat',
    'babel'
  ],

  'env': {
    'browser': true,
    'jquery': true
  },

  'globals': {
    'd3': true,
    'document': true,
    'window': true
  },

  'rules': {
    // Browser compatibility
    'compat/compat': 'error',

    // ensure JSDoc comments are valid
    // https://eslint.org/docs/rules/valid-jsdoc
    'valid-jsdoc': ['warn', {
      'prefer': {
        'arg': 'param',
        'argument': 'param',
        'class': 'class',
        'return': 'returns'
      },
      'requireReturn': false
    }],

    // Don't enforce disallowing of mixed operators.
    // We use lots of algebra for positioning/etc that gets flagged by this.
    // https://eslint.org/docs/rules/no-mixed-operators
    'no-mixed-operators': ['off'],

    // Ignore certain globals:
    // - IsNaN - due to our previous assumptions in code about how it sometimes will return 'false', and because `Number.isNaN` has no native IE11 support.
    // for things that are not numbers (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN#Examples).
    // https://eslint.org/docs/rules/no-restricted-globals
    'no-restricted-globals': ['off', 'isNaN'],

    // Ignore errors for continue statements, currently used in:
    // - Mask
    // - Validation
    // https://eslint.org/docs/rules/no-continue
    'no-continue': ['off']
  }
};
