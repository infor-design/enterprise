// ======================================================
// NOTE: Depends on airbnb's basic eslint settings, which need to be installed
// via npm install. To install specific versions and update the package.json
// se
// some pretty specific commands per your environment.
// See: https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb
// ======================================================

module.exports = {
  // Only import some air bnb rules
  // https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base/rules
  'extends': 'airbnb-base',
  'parserOptions': {
    'ecmaVersion': 6,
    'sourceType': 'module'
  },
  'env': {
    'browser': true,
    'jquery': true,
    'node': false
  },
  'rules': {
    // require function expressions to have a name
    // https://eslint.org/docs/rules/func-names
    'func-names': 'off',

    // require trailing commas in multiline object literals
    'comma-dangle': ['off', {
      'arrays': 'never',
      'objects': 'never',
      'imports': 'never',
      'exports': 'never',
      'functions': 'never'
    }],

    // enforce line breaks between braces
    // https://eslint.org/docs/rules/object-curly-newline
    'object-curly-newline': ['error', {
      ObjectExpression: { minProperties: 8, multiline: true, consistent: true },
      ObjectPattern: { minProperties: 8, multiline: true, consistent: true }
    }],

    // disallow use of unary operators, ++ and --
    // https://eslint.org/docs/rules/no-plusplus
    'no-plusplus': 'off',

    // disallow multiple empty lines and only one newline at the end
    'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 1 }],

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

    // disallow use of chained assignment expressions
    // https://eslint.org/docs/rules/no-multi-assign
    'no-multi-assign': ['warn'],

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

    // Prefer destructuring from arrays and objects
    // https://eslint.org/docs/rules/prefer-destructuring
    'prefer-destructuring': ['off', {
      VariableDeclarator: {
        array: false,
        object: true,
      },
      AssignmentExpression: {
        array: true,
        object: true,
      },
    }, {
      enforceForRenamedProperties: false,
    }],

    // don't enforce arrow functions
    // https://eslint.org/docs/rules/prefer-arrow-callback
    'prefer-arrow-callback': ['warn', {}],

    // don't enforce disallowing of mixed operators.
    // We use lots of algebra for positioning/etc that gets flagged by this.
    // https://eslint.org/docs/rules/no-mixed-operators
    'no-mixed-operators': ['off'],

    // Require modules with a single export to use a default export
    // Will ignore because of https://medium.com/@timoxley/named-exports-as-the-default-export-api-670b1b554f65
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md
    'import/prefer-default-export': 'off',

    // Ignore certain globals:
    // - IsNaN - due to our previous assumptions in code about how it sometimes will return 'false'
    // for things that are not numbers (see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN#Examples).
    // https://eslint.org/docs/rules/no-restricted-globals
    'no-restricted-globals': ['off', 'isNaN']

  },
  'globals': {
    'd3': false
  }
};
