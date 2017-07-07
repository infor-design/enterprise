define([
  'fs'
], function(fs) {

  'use strict';

  // Helper methods for tests that assist with async, etc.

  return {
    recordImage: function(filename, buffer) {
      if (!filename || typeof filename !== 'string') {
        throw new Error('No filename provided for recording an image');
      }

      if (!buffer) {
        throw new Error('No buffer passed');
      }

      return fs.writeFileSync('copypasta-test.png', buffer, 'base64');
    },

    sleep: function(ms) {
      var dfd = new Promise.Deferred();
      setTimeout(function() {
        dfd.resolve();
      }, ms);
      return dfd.promise();
    }
  };

});
