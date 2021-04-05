/**
 * JS Scripts Lint Rules
 * NOTE: Remember that this cascades on top of the rules from the project root folder.
 */
module.exports = {
  // All scripts in this folder should be compatible with Node 12+, so make everything ES6-friendly.
  'env': {
    'es6': true,
    'node': true
  },

  // Need `ecmaVersion: 9` for:
  // - [Object spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#Spread_in_object_literals)
  'parserOptions': {
    'ecmaVersion': 9,
    'sourceType': 'module'
  },

  'rules': {
    // Forbid the use of extraneous packages
    // paths are treated both as absolute paths, and relative to process.cwd()
    'import/no-extraneous-dependencies': ['off'],

    // disallow reassignment of function parameters
    // disallow parameter object manipulation except for specific exclusions
    // rule: https://eslint.org/docs/rules/no-param-reassign.html
    'no-param-reassign': ['off', {
      props: true,
      ignorePropertyModificationsFor: [
        'acc', // for reduce accumulators
        'e', // for e.returnvalue
        'ctx', // for Koa routing
        'req', // for Express requests
        'request', // for Express requests
        'res', // for Express responses
        'response', // for Express responses
        '$scope', // for Angular 1 scopes
      ]
    }],

    // Some of our Regexes in the build script are picking up a "useless" escape character that isn't useless.
    'no-useless-escape': ['off']
  }
};
