// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while
  // executing the test
  collectCoverage: false,

  testTimeout: 6000,

  // A preset that is used as a base for Jest's configuration
  preset: 'jest-puppeteer',

  // A list of paths to modules that run some code to configure
  // or set up the testing framework before each test
  setupFilesAfterEnv: [
    '@wordpress/jest-puppeteer-axe'
  ],

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/test/components/**/*puppeteer*.js'
  ]
};
