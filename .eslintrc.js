/**
 * Baseline rules for ESLint
 * ----------------------------------------------------------------------------
 * NOTE: Depends on airbnb's basic eslint settings, which need to be installed
 * via npm install. To install specific versions and update the package.json
 * ----------------------------------------------------------------------------
 * NPM Dependencies:
 * - `eslint-config-airbnb-base`
 * - `eslint-plugin-compat`,
 * - `eslint-plugin-import`,
 * - `eslint-plugin-jasmine`,
 * - `eslint-plugin-jasmine-jquery`
 */
module.exports = {
  'extends': [
    // Only import some AirBNB rules
    // https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base/rules
    'airbnb-base'
  ],

  // This is the root eslint file.
  // We should ONLY be using eslint rules specific to this project.
  'root': true,

  // All source code is at least ES6 friendly.
  // Note that this is not the case in the demoapp example pages,
  // which are ES5 compatible and not compiled.
  'env': {
    'es6': true
  },

  // Need `ecmaVersion: 9` for:
  // - [Object spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#Spread_in_object_literals)
  'parser': "babel-eslint",
  'parserOptions': {
    'ecmaVersion': 9,
    'sourceType': 'module'
  },

  // Add ES6 import plugins
  'plugins': [
    'import'
  ],

  'rules': {
    // require trailing commas in multiline object literals
    'comma-dangle': ['off', {
      'arrays': 'never',
      'objects': 'never',
      'imports': 'never',
      'exports': 'never',
      'functions': 'never'
    }],

    // Re-enable anonymous/unnamed functions
    // https://eslint.org/docs/rules/func-names
    'func-names': 'off',

    // Require modules with a single export to use a default export
    // Will ignore because of https://medium.com/@timoxley/named-exports-as-the-default-export-api-670b1b554f65
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md
    'import/prefer-default-export': 'off',

    // specify the maximum length of a line in your program
    // https://eslint.org/docs/rules/max-len
    'max-len': ['error', {
      code: 100,
      comments: 350,
      ignoreUrls: true,
      ignoreComments: false,
      ignoreRegExpLiterals: true,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],

    // disallow use of chained assignment expressions
    // https://eslint.org/docs/rules/no-multi-assign
    'no-multi-assign': ['warn'],

    // disallow multiple empty lines and only one newline at the end
    'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],

    // Don't allow paramter reassignment
    'no-param-reassign': ['off', {
      props: true,
    }],

    // disallow use of unary operators, ++ and --
    // https://eslint.org/docs/rules/no-plusplus
    'no-plusplus': 'off',

    // Allow usage of certain Global values
    'no-restricted-globals': ['warn', {
      'name': 'isNaN',
      'message': 'Make sure to explore using `Number.isNaN()` instead.'
    }],

    // Ignore usage of certain properties:
    // - Math.pow (not really sure why AirBNB doesn't allow this)
    'no-restricted-properties': ['off', {
      'object': 'Math',
      'property': 'pow'
    }],

    // set "no-trailing-spaces" to only a warning (this shouldn't fail builds)
    'no-trailing-spaces': ['warn'],

    // set "no-underscore-dangle" to only a warning (also shouldn't fail builds)
    'no-underscore-dangle': ['warn'],

    // enforce line breaks between braces
    // https://eslint.org/docs/rules/object-curly-newline
    'object-curly-newline': ['error', {
      ObjectExpression: {
        minProperties: 8,
        multiline: true,
        consistent: true
      },
      ObjectPattern: {
        minProperties: 8,
        multiline: true,
        consistent: true
      }
    }],

    // Don't enforce usage of arrow functions, but warn about them.
    // https://eslint.org/docs/rules/prefer-arrow-callback
    'prefer-arrow-callback': ['warn', {}],

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

    // Don't enforce extra brackets
    // https://eslint.org/docs/2.0.0/rules/arrow-parensextra
    'arrow-parens': ['error', 'as-needed', { 'requireForBlockBody' : true }],

    // Have operators on same line
    // https://eslint.org/docs/rules/operator-linebreak
    'operator-linebreak': ['error', 'after']
  }
};
