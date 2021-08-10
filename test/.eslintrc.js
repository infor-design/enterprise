/**
 * Test Suite's lint rules
 * NOTE: Remember that this cascades on top of the rules from the project root folder.
 */
module.exports = {
  extends: [
    'plugin:compat/recommended',
    'plugin:jasmine/recommended',
    'plugin:jasmine-jquery/recommended'
  ],

  plugins: [
    'jasmine',
    'jasmine-jquery',
  ],

  env: {
    es6: true,
    jasmine: true,
    jquery: true,
    node: true,
    protractor: true,
    browser: true
  },

  globals: {
    jestPuppeteer: true,
    page: true,
    browser: true,
    jest: true,
    document: true,
    requireHelper: true,
    spyOnEvent: true,
    window: true,
    CustomEvent: true,
    HTMLElement: true,
    SVGElement: true,
    Soho: true,
  },

  rules: {
    // Allow warns for deprecation messages.
    // This allows us to show warnings while running tests without accidentally failing builds!
    // https://eslint.org/docs/rules/no-console
    'no-console': ['warn', {
      allow: ['warn']
    }],

    // Disallow use of disabled tests (Jasmine)
    'jasmine/no-disabled-tests': ['off'],

    // Allow same name in different describes
    'jasmine/no-spec-dupes': [1, 'branch'],
    'jasmine/no-suite-dupes': [1, 'branch'],

    // Allow toHaveBeenCalledWith
    'jasmine/prefer-toHaveBeenCalledWith': ['off'],

    // Dont worry about the extra lines
    'jasmine/new-line-before-expect': ['off'],

    // set "no-underscore-dangle" to only a warning (also shouldn't fail builds)
    'no-underscore-dangle': ['warn', { allow: ['_client'] }]
  }
};
