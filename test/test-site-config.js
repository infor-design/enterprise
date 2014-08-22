/***
 *  HTTP Server Configuration
 *  Define all the settings for the HTTP server that is used for serving the client-side
 *  files used by unit tests.
***/
var app = require('../app');
require('./test-env');

// Setup the HTTP Server that will serve the files for our Test
var testSite = {
  host: 'http://localhost', // Infor Hosted Test Server: http://107.170.15.202:4000//
  port: '3001',
  rootUrl: function() {
    return this.host + ':' + this.port;
  }
};
app.locals.enableLiveReload = false;
testSite.server = app.listen(testSite.port);

module.exports = testSite;
