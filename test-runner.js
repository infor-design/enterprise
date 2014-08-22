/***
 *  Selenium Test Runner for SoHo 2.0 Controls
 *  @author  ecoyle;
***/
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var Mocha = require('mocha');
var site = require('./test/test-site-config');
var client, specFiles;

// Place all environment variables into the file "test-env.js"
require('./test/test-env.js');

// Let's introduce ourselves
console.log('SoHo 2.0 Controls - Test Suite'.green);

// Build a new Mocha instance
var mocha = new Mocha({
  ui: 'bdd',
  reporter: 'spec',
  timeout: 30000,
  slow: 10000
});

// setup the files needed for the test suite.
// if there are command-line arguments fed to the test suite, use them as directories for testing.
if ( process.argv[2] ) {
  specFiles = process.argv[2];
} else {
  // otherwise test everything
  specFiles = 'test/spec/**/*.js';
}

// use glob to pull files from the filesystem based on the pattern.
glob(process.env._SPEC || specFiles, function(er, files) {

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

// setup assertion libraries to be global for all tests
chai = require('chai'),
expect = chai.expect,
should = chai.should();
assert = chai.assert;

// Setup a global object that will be used to invoke test-driver instances.
// globals.setup is run in every test to ensure that the same Selenium instance
// is continually used between tests, unless a test specifically requests
// a unique instance.
globals = {
    noError: function(err) {
        assert(err === undefined);
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
  clientToUse.url( siteToUse.currentUrl );

  return {
    site: siteToUse,
    client: clientToUse
  };
};
