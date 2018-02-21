/***
 *  Selenium Test Runner for SoHo 2.0 Controls
 *  @author  ecoyle;
***/
var fs = require('fs');
var glob = require('glob');
var Mocha = require('mocha');
var os = require('os');
var path = require('path');
var site = require('./test/test-site-config');
var client, specFiles;

// Performs a recursive search down into a directory structure.
function search(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) { return done(err); }
    var pending = list.length;
    if (!pending) { return done(null, results); }
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          search(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) { done(null, results); }
          });
        } else {
          results.push(file);
          if (!--pending) { done(null, results); }
        }
      });
    });
  });
}

// Place all environment variables into the file "test-env.js"
require('./test/test-env.js');

// setup assertion libraries to be global for all tests
chai = require('chai'),
should = chai.should();

// Polyfill for .contains();
function contains(string, snippet) {
  return string.indexOf(snippet) !== -1;
}

// Loads files into Mocha and runs them.
function run(specFilePath) {
  // use glob to pull files from the filesystem based on the pattern.
  glob(specFilePath, function(er, files) {

    if (files.length === 0) {
      console.error('Could not find any files that matched the search parameter "'.red + specFilePath + '".  Now exiting the test runner...'.red);
      process.exit();
    }

    files.forEach(function(file) {
      mocha.addFile(file);
    });

    mocha.run(function(failures) {
      // shut down HTTP server
      site.server.close();

      if (!client) {
        return process.exit(failures);
      }
      client.end(function() {
        process.exit(failures);
      });
    });
  });
}

// Setup the files needed for the test suite.
// If there are command-line arguments fed to the test suite, use them as directories for testing.
// By default (when no arguments are present), the test suite will run ALL available test files.
// 'process.argv[2]' can be the following:
// - empty (runs all tests)
// - a control name (EX: 'dropdown' will run all tests in the /test/spec/dropdown/ folder)
// - a file path (EX: '/test/spec/mask' will run all tests in the /test/spec/mask/ folder)
// - a file name (EX: 'globalize-mocha-tests.js' will search the test directory tree, find that test, and run it).
// Any non standard entry into 'process.argv[2]' should simply run all tests.
function buildSpecSearchPath(done) {
  specFiles = 'test/spec/**/*.js';

  // If no arguments are provided, run all the tests
  if (!process.argv[2]) {
    console.log('No filter paramters were provided. Running all tests...'.yellow);
    return done(specFiles);
  }

  var filePathRegex = /(\\|\/)/g,
    fileExtensionRegex = /.js/g,
    hasFilePath = filePathRegex.test(process.argv[2]),
    hasFileExtension = fileExtensionRegex.test(process.argv[2]);

  // Run the test runner on just this one specific file
  if (hasFilePath && hasFileExtension) {
    console.log('The filter paramter provided contained a full file path.  Running the test file "'.yellow + process.argv[2] + '".'.yellow);
    return done(process.argv[2]);
  }

  // Search out all tests that live inside of a specific folder
  if (hasFilePath) {
    var lastChar = process.argv[2].substring(process.argv[2].length - 1, process.argv[2].length),
      folderPath = process.argv[2] + (filePathRegex.test(lastChar) ? '' : path.sep) + '*.js';
    console.log('Running files located in the directory "'.yellow + process.argv[2] + '.'.yellow);
    return done(folderPath);
  }

  // Get the filename and path of the test we want to run and assign it to specFiles (runs a single specific file)
  if (hasFileExtension) {
    var lastSlash = process.argv[2].lastIndexOf(path.sep),
      fileName = process.argv[2].substring( (lastSlash ? lastSlash : 0), process.argv[2].length );

    console.log('Found filename "'.yellow + fileName + '" in provided search parameter.  Searching for this file in the "/test/spec" folder...'.yellow);
    return search('test/spec', function(err, results) {
      if (err) { throw err; }
      var count = 0;
      while(count < results.length) {
        if (contains(results[count], fileName)) {
          console.log('Using file "'.yellow + results[count] + '" in test suite...'.yellow);
          return done(results[count]);
        }
        count++;
      }

      // If the file name isn't found within the directory crawl results, simply run all the tests.
      console.error('Search results did not contain the file "' + fileName.white + '". Running all tests...');
      return done(specFiles);
    });
  }

  // If the filter parameter doesn't have a file extension OR a determinable path, run all tests in a specific folder
  console.log('Filter parameter provided didn\'t contain a file path or extension.  Running all tests in the directory "'.yellow + 'test/spec/' + process.argv[2] + '".'.yellow);
  return done('test/spec/*'+process.argv[2]+'*/*.js');
}

// Setup a global object that will be used to invoke test-driver instances.
// globals.setup is run in every test to ensure that the same Selenium instance
// is continually used between tests, unless a test specifically requests
// a unique instance.
globals = {
  noError: function() {
    return require('./test/generic-error-handler');
  },
  checkResult: function(expected) {
    return function(err, result) {
      globals.noError(err);
      if(expected instanceof Array) {
        expected.should.containDeep([result]);
      } else {
        expected.should.be.exactly(result);
      }
    };
  }
};

// Helpers for keypresses within the test suite.
// Some keystrokes (such as copy/paste) can vary depending on the testing platform.  The strings defined below
// normalizes certain keys across platforms & test enviromments to ensure these keystrokes can be performed properly.
globals.keys = {
  control: (os.platform() === 'darwin' && process.env.TEST_BROWSER !== 'phantomjs') ? 'Command' : 'Control'
};

globals.setup = function(newSession, url) {
  var wdjs = require('./test/test-driver-config');
  var clientToUse, siteToUse;

  // define the site to use
  siteToUse = site;

  // if instance already exists and no new session was requested return existing instance
  if (client && !newSession && newSession !== null) {
    clientToUse = client;

  // if new session was requested create temporary instance
  } else if(newSession && newSession !== null) {
    clientToUse = wdjs.init();

  // otherwise store created intance for other specs
  } else {
    clientToUse = client = wdjs.init();
  }

  // setup a "currentUrl" for use by tests to setup any individualized dependencies.
  siteToUse.currentUrl = url ? site.rootUrl() + url : site.rootUrl();
  clientToUse.url(siteToUse.currentUrl);

  return {
    site: siteToUse,
    client: clientToUse
  };
};

// Let's introduce ourselves
console.log('SoHo XI Controls - Test Suite'.green);
console.log('Operating System: '.yellow + os.platform());
console.log('Test Browser: '.yellow + process.env.TEST_BROWSER);
console.log('Control/Command Key?  '.yellow + globals.keys.control);

// Build a new Mocha instance
var mocha = new Mocha({
  ui: 'bdd',
  reporter: 'spec-xunit-file',
  timeout: 30000,
  slow: 10000
});

// Finally, Kick-off the Test Runner
buildSpecSearchPath(run);
